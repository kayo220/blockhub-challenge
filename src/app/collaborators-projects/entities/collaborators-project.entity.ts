import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import mongoose from "mongoose";
import { Document } from 'mongoose';
import { Collaborator } from "src/app/collaborators/entities/collaborator.entity";
import { Project } from "src/app/projects/entities/project.entity";

export type CollaboratorsProjectsDocument = CollaboratorsProjects & Document;

@Schema()
export class CollaboratorsProjects {


    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Project.name })
    @Type(() => Project)
    project: Project;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Collaborator.name })
    @Type(() => Collaborator)
    collaborator: Collaborator;

    @Prop({ required: true })
    begin: Date;

    @Prop({required: true})
    end: Date;

    @Prop({ default: true })
    active: boolean;
}

export const CollaboratorsProjectsSchema = SchemaFactory.createForClass(CollaboratorsProjects);