const pool = require('../db');

const getPuzzle = async (req, res, next) => {
    const { puzzle_id } = req.body;

    try {
        const allTasks = await pool.query('SELECT * FROM pieces WHERE puzzle_id=$1', [puzzle_id]);
        res.json(allTasks.rows)
    } catch (err){
        next(err);
    }
};

const createPuzzle = async (req, res, next) => {
    const { imagePath, numCols, numRows, userId } = req.body;

    try {
        const result = await pool.query(
            `
            INSERT INTO puzzles (original_image_url, num_cols, num_rows, user_id)
            VALUES
                ('${imagePath}', '${numCols}', '${numRows}', '${userId}')
            RETURNING *;
            `
        );

        res.json(result.rows[0])
    } catch (err) {
        next(err);
    }
};

const createUser = async (req, res, next) => {
    const { username, pass } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO users (username, pass) VALUES ($1, $2)', [username, pass]
        );

        res.json(result.rows[0])
    } catch (err) {
        next(err);
    }
};

const insertPieces = async (req, res, next) => {
    const { localId, imgSrc, dimensions, currentLocation, trueLocation, puzzleId } = req.body;

    try {
        const result = await pool.query(
            `
                INSERT INTO pieces (local_id, img_src, dimensions, current_location, true_location, puzzle_id)
                VALUES 
                    (${localId}, ${imgSrc}, '${dimensions}', '${currentLocation}', '${trueLocation}', ${puzzleId})
                RETURNING *;
            `
        );

        res.json(result.rows[0])
    } catch (err) {
        next(err);
    }
};

const deletePuzzle = async (req, res, next) => {
    const { puzzle_id } = req.body;

    try {
        const result = await pool.query(
            'DELETE * FROM puzzles WHERE id = $1', [puzzle_id]
        );

        res.json(result.rows[0])
    } catch (err) {
        next(err);
    }   
};

const deleteUser = async (req, res, next) => {
    const { user_id } = req.body;

    try {
        const result = await pool.query(
            'DELETE * FROM users WHERE id = $1', [user_id]
        );

        res.json(result.rows[0])
    } catch (err) {
        next(err);
    }   
};

const updatePiece = async (req, res, next) => {
    const { puzzle_id, piece_id, current_location } = req.body;

    try {
        const result = await pool.query(
            'UPDATE pieces SET current_location=$1 WHERE puzzle_id=$2 AND local_id=$3 RETURNING *', 
            [current_location, puzzle_id, piece_id]
        );

        res.json(result.rows[0])
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getPuzzle,
    createPuzzle,
    createUser,
    insertPieces,
    deletePuzzle,
    deleteUser,
    updatePiece
};