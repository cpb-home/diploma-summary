import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
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
  constructor(commonController: CommonController, clientController: ClientController) {
    this.commonController = commonController;
    this.clientController = clientController;
  }

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async addSupportMessage(
    @MessageBody() data: RequestMessageDto,
    @ConnectedSocket() client: Socket
  ): Promise<string> {
    const id: string = String(data.userId);
    const addedMessage = await this.commonController.sendMessage({text: data.text, managerId: data.managerId}, {id: id});
    client.emit('message', 'Пришло новое сообщение'); console.log('got');
    return 'Получение ' + data;
  }

  @SubscribeMessage('supportUsersList')
  async returnSupportUsers(
    @ConnectedSocket() client: Socket
  ): Promise<ResponseUserWithCountDto[]> {

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
    const messages = await this.commonController.getAllmessages({id: data}); 
    
    return messages;
  }
}
