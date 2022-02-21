import { User } from "../entities/user.entity";
import { Document } from 'mongoose';

export default {
    render(user: User & Document<any, any, any> & { _id: any; }) {
        return {
            id: user._id,
            username: user.username,
            active: user.active
        };
    },
    renderMany(images: (User & Document<any, any, any> & { _id: any; })[]) {
        return images.map(user => this.render(user))
    }
};