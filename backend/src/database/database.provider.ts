// src/database/database.provider.ts
import { Sequelize } from 'sequelize-typescript';
import { SurgeryRooms } from 'src/operations/surgery-rooms/entities/surgery-rooms.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'nestjs_db',
        models: [SurgeryRooms],
      });
      
      try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
        
        // Sync all models
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ All models were synchronized successfully.');
        
      } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
      }
      
      return sequelize;
    },
  },
];