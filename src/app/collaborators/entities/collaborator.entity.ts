import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CollaboratorDocument = Collaborator & Document;

@Schema()
export class Collaborator {


    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true })
    admission: Date;

    @Prop({ default: true })
    active: boolean;
}

export const CollaboratorSchema = SchemaFactory.createForClass(Collaborator);