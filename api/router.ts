
import { createDog, deleteDog, getDogById, getDogs } from "./controllers/dog";
import { createRouter } from "../lib/utils";


export const router = createRouter()


router.get('/api/dogs', getDogs)
router.get('/api/dogs/:id', getDogById)
router.post('/api/dogs', createDog)
router.delete('/api/dogs/:id', deleteDog)


