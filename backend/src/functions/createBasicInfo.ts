import { createHash } from "crypto";
import { AdminService } from "src/admin/admin.service";
import { CommonService } from "src/common/common.service";
import { CreateRoomDto } from "src/interfaces/dto/create-room";
import { Types } from "mongoose";


async function createRooms(adminService: AdminService, commonService: CommonService): Promise<string> {
  const isEnabled = [true, false];
  const description = [
    'Одноместный (SGL, single или сингл). Предназначен для размещения одного человека и комплектуется одной кроватью.',
    'Двухместный с одной кроватью (DBL, double room или дабл). Предусматривает установку одной двуспальной кровати и проживание двух постояльцев.',
    'Двухместный с двумя кроватями (TWIN или твин). Также предназначен для двух постояльцев и комплектуется аналогичным числом односпальных кроватей.',
    'Трехместный (TRPL, triple или трипл). Однокомнатный гостиничный номер, который предназначен для проживания трех человек и укомплектован тремя односпальными кроватями.',
    'Трехместный (TRPL, triple или трипл). Однокомнатный гостиничный номер, который предназначен для проживания трех человек и укомплектован одной двуспальной и одной односпальной.',
    'Четырехместный (QDPL, quadriple или квадрипл). Однокомнатный номер для размещения четырех человек. Комплектуется: одной двуспальной и двумя односпальными кроватями или четырьмя односпальными.'
  ];
  const allHotels = await commonService.getAllHotels();

  for (const hotel of allHotels) {
    const roomNumber = Array.from(Array(Math.floor(Math.random() * 13)).keys());

    for (const roomNum of roomNumber) {
      const newRoom: CreateRoomDto = {
        hotel: new Types.ObjectId(hotel._id.toString()),
        description: description[Math.floor(Math.random() * 6)],
        createdAt: new Date(),
        updatedAt: new Date(),
        isEnabled: isEnabled[Math.floor(Math.random() * 2)]
      };
      
      await adminService.createRoom(newRoom);
    }
  }

  return 'Номера для гостиниц созданы';
}

/**
 * Функция создаёт верховного админа, чтобы добавить обычных админов
 * @param adminService сервис админа
 * @returns string сообщение о создании админа
 */
async function createSuperAdmin(adminService: AdminService): Promise<string> {
  const allUsers = await adminService.getAllUsers();
  let message = 'Верховный админ уже существует';
  if (allUsers) {
    const mainAdmin = allUsers.find(e => e.email === 'mainAdmin@admin.ru');
    if (!mainAdmin) {
      const pass = '55555';
      const hash = createHash("md5").update(pass).digest("hex");
        await adminService.createUser({
        email: "admin@admin.ru",
        password: pass,// hash,
        name: "main",
        contactPhone: "55555",
        role: "mainAdmin"
      });
      message = 'Верховный админ создан. Логин: admin@admin.ru, пароль: 55555';
    }
  }

  return message;
}

/**
 * Функция, для отладки создающая по умолчанию 15 гостиниц
 * @param adminService сервис админа
 * @returns string сообщение о создании гостиниц
 */
async function createHotels(adminService: AdminService): Promise<string> {
  // 15 гостиниц для отладки
  const hotelNames = [
    'Radisson',
    'Atlantis Temple Hotel & Spa',
    'Soft Bay Resort & Spa',
    'Autumn Bliss Resort',
    'Pleasant Shield Resort & Spa',
    'Private Shrine Hotel',
    'Silver Peaks Motel',
    "Queen's Luxury Hotel & Spa",
    'Ivory Chasm Resort',
    'Remote Heights Hotel & Spa',
    'Exalted Cave Motel',
    'Twin Haven Resort & Spa',
    'Serene Bliss Resort & Spa',
    'Exalted Harbor Motel',
    'Southern Brewery Hotel',
    'Summer Excalibur Motel'
  ];

  for (let i = 1; i < 16; i++) {
    const hotel = hotelNames.pop();
    const title = `Гостиница ${hotel}`;
    const description = `Какое-то разумное, но не слишком громоздкое описание Гостиницы ${hotel}.\n Вот какое есть!`;
    await adminService.createHotel({title, description});
  }

  return '15 гостиниц созданы';
}

/**
 * Функция,  по умолчанию создающая для отладки гостиницы, номера, пользователей
 * @param adminService : AdminService - сервис с методами создания
 * @returns void
 */
export default async function createBasicInfo(adminService: AdminService, commonService: CommonService): Promise<string> {
  let message = '\n';
  
  message += await (createSuperAdmin(adminService)) + '<br>';
  message += await createHotels(adminService) + '<br>';
  message += await createRooms(adminService, commonService) + '<br>';

  return message;
}