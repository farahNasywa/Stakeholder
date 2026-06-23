// // routes/focalPointMappingRoutes.js
// import express from 'express';
// import {
//   getAllFocalPointMappings,
//   getFocalPointMappingByStakeholderType,
//   createFocalPointMapping,
//   updateFocalPointMapping,
//   deleteFocalPointMapping
// } from '../controllers/focalPointMappingController.js';

// const router = express.Router();

// router.get('/', getAllFocalPointMappings);
// router.get('/stakeholder/:stakeholderType', getFocalPointMappingByStakeholderType);
// router.post('/', createFocalPointMapping);
// router.put('/:id', updateFocalPointMapping);
// router.delete('/:id', deleteFocalPointMapping);

// export default router;

// routes/focalPointRoutes.js
// focalPointMappingRoutes.js
import express from 'express';
import { getFocalPointMappingByStakeholderTypeId } from '../controllers/focalPointMappingController.js';

const router = express.Router();

router.get('/:stakeholderTypeId', getFocalPointMappingByStakeholderTypeId);

export default router;