import { PrismaClient } from "@prisma/client";



 const prisma = new PrismaClient();



export default prisma;
async function checkDatabaseConnection() {
    try {
      await prisma.combine_categories.findMany();
      console.log('mysql connection is healthy');
    } catch (error) {
      console.error('mysql connection is lost:', error);
      // Implement your action here, such as reconnecting, notifying, or taking other measures
    }
  }

checkDatabaseConnection()

export const checkInterval = setInterval(checkDatabaseConnection, 1000 * 60 * 10);

// Stop checking when the application is shutting down

process.on('SIGINT', () => {
  clearInterval(checkInterval);
  prisma.$disconnect();
  console.log('Application is shutting down');
  process.exit(0);
});
