// Description: Module for handling translations in the application.
import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';

@Module({
    imports: [],
    controllers: [],
    providers: [TranslationService],
    exports: [TranslationService],
})
export class TranslationModule {}
