import googleSheetController from '../controllers/googleSheetController.js';
import express from 'express';
const router = express.Router();

router.get('/:spreadsheetId', googleSheetController.getData);
router.post('/:spreadsheetId/add', googleSheetController.addData);
router.put('/:spreadsheetId/update', googleSheetController.updateData);
router.delete('/:spreadsheetId/delete', googleSheetController.deleteData);
router.post('/:spreadsheetId/save', googleSheetController.saveAnswers);
router.post('/:spreadsheetId/save-form', googleSheetController.saveForm);
router.get('/:spreadsheetId/levels', googleSheetController.getLevels);
router.get("/:spreadsheetId/justification", googleSheetController.getJustification);
router.post("/:spreadsheetId/save-justification", googleSheetController.saveJustification);

export default router;
