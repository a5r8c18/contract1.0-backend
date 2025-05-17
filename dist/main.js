"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'Uploads'), {
        prefix: '/Uploads/',
    });
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:5173'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    const port = configService.get('PORT', 3000);
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
    console.error('Failed to start the application:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map