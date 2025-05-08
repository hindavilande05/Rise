const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.post('/recommend', (req, res) => {
    const userInput = JSON.stringify(req.body);
    const scriptPath = path.join(__dirname, '../recommend_ev_knn.py');

    const python = spawn('python', [scriptPath, userInput]);

    let result = '';
    python.stdout.on('data', (data) => result += data.toString());
    python.stderr.on('data', (data) => console.error('Error:', data.toString()));

    python.on('close', (code) => {
        try {
            const response = JSON.parse(result);
            res.json({ success: true, recommendations: response });
        } catch (e) {
            res.status(500).json({ success: false, message: 'Failed to parse Python output', error: e.message });
        }
    });
});

module.exports = router;

//using cosine similarity

// router.post('/recommend', (req, res) => {
//     const userInput = JSON.stringify(req.body);
//     const pythonScriptPath = path.join(__dirname, '../recommend_ev.py'); 
//     const python = spawn('python', [pythonScriptPath, userInput]);

//     let result = '';
//     python.stdout.on('data', data => result += data.toString());
//     python.stderr.on('data', data => console.error('Error:', data.toString()));

//     python.on('close', code => {
//         try {
//             const recommendations = JSON.parse(result);
//             res.json({ success: true, recommendations });
//         } catch (e) {
//             res.status(500).json({ success: false, message: 'Failed to parse recommendations', error: e.message });
//         }
//     });
// });


