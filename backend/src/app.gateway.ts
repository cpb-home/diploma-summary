import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CommonController } from './common/common.controller';
import { ClientController } from './client/client.controller';
import { ResponeSupportMessage } from './interfaces/dto/response-supportMessage';
import { RequestMessageDto } from './interfaces/dto/request - message';
import { ResponseUserWithCountDto } from './interfaces/dto/response-userWithCount';

@WebSocketGateway({ cors: true })
export class AppGateway {
  private commonController: CommonController;
  private clientController: ClientController;
  private sockets: Map<string, Socket>;

  constructor(commonController: CommonController, clientController: ClientController) {
    this.commonController = commonController;
    this.clientController = clientController;
    this.sockets = new Map<string, Socket>();
  }

  handleConnection(client: Socket): void {
    const handshake = client.handshake;
    const query = handshake.query;
    const userId = query.userId;
    const role = query.userRole;

    if (userId && role) {
      this.sockets.set(String(userId), client);
      
      if (role === 'manager') {
        client.join('supportGroup');
      }
      client['currentUser'] = { id: userId, role: role };
      console.log(`Подключен клиент ws: ${client.id}, User ID: ${userId}, Role: ${role}`);
    } else {
      console.log(`Клиент ws подключен без ид и роли: ${client.id}, User ID: ${userId}, Role: ${role}`);
    }
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
    const handshake = client.handshake;
    const query = handshake.query;
    const userId = query.userId;
    const role = query.userRole;

    if (userId && role) {
      if (role === 'manager') {
        client.leave('supportGroup');
      }
    }
  }

  @SubscribeMessage('message')
  async addSupportMessage(
    @MessageBody() data: RequestMessageDto,
    @ConnectedSocket() client: Socket
  ): Promise<any> {
    const currentUser = client['currentUser'];
    
    if (currentUser) {
      const id: string = String(currentUser.id);
      const replyUserId: string | null = data.replyUserId; 

      if (currentUser.role === 'manager') {
        const foundSocket = this.sockets.get(replyUserId);
        if (foundSocket) {
          foundSocket.emit('message', 'Новое сообщение manager->user');
        }
        client.to('supportGroup').emit('message', 'Новое сообщение manager->manager');
      } else {
        client.to('supportGroup').emit('message', 'Новое сообщение user->manager');
      }
      
      const addedMessage = await this.commonController.sendMessage({text: data.text, replyUserId: data.replyUserId}, {id: id});
      client.emit('message', 'Пришло новое сообщение отправителю'); console.log('got');
      return data;
    }
  }

  @SubscribeMessage('supportUsersList')
  async returnSupportUsers(
    @ConnectedSocket() client: Socket
  ): Promise<ResponseUserWithCountDto[]> {
    const currentUser = client['currentUser']; 
    if (currentUser) {
      console.log('supportUsersList incoming user', currentUser);
    }
    const users = await this.commonController.getAllSupportUsers();
    const usersWithCount: ResponseUserWithCountDto[] = [];
    if (users) {
      for (const user of users) {
        const count = await this.commonController.getUserUnreadCount({id: String(user.id)});
        const newInfo = {
          id: user.id,
          name: user.name,
          unreadCount: count        
        }
        usersWithCount.push(newInfo);
      }
    }
    
    return usersWithCount;
  }

  @SubscribeMessage('requestMessagesList')
  async returnMessageList(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): Promise<ResponeSupportMessage[]> {
    const currentUser = client['currentUser'];
    if (currentUser) {
      console.log('requestMessagesList incoming user', currentUser);
    }
    const messages = await this.commonController.getAllmessages({id: data}); 
    
    return messages;
  }
}