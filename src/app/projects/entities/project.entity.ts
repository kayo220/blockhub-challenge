import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {

    @Prop({ unique: true, required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    begin: Date;

    @Prop()
    end: Date;

    @Prop({ default: true })
    active: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);