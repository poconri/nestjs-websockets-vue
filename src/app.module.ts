import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static';
import { join } from 'path';
import { RankingGateway } from './ranking/ranking.gateway';

@Module({
  imports: [
	ServeStaticModule.forRoot({
		rootPath: join(__dirname, '..', 'client/dist'),
	  }),
  ],
  controllers: [AppController],
  providers: [AppService, RankingGateway],
})

export class AppModule implements OnModuleInit {
	constructor(private rankingGateway: RankingGateway) {}
  
	onModuleInit() {
	  this.rankingGateway.sendNewScore();
	}
  }