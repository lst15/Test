import * as mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gameDate: { type: Date, required: true, default: Date.now },
    failed: { type: Number, required: true },
    difficulty: {
        type: String,
        required: true,
        enum: ['Easy', 'Normal', 'Hard'],
    },
    completed: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
});

export const Game = mongoose.model('Game', gameSchema);
