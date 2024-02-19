
import { NodeResponse, ServerRequest } from "../../lib/utils"
import { dogService } from "../services/dog"

export async function getDogs(req: ServerRequest, res: NodeResponse) {

        const [dogs, error] = await dogService.getDogs()

        if(error){
            res.error('No dogs here, sorry ;(', 404)
            return
        }

        res.sendJson(dogs)
}

export async function getDogById(req: ServerRequest, res: NodeResponse) {

    if (!req?.params?.id) {
        return res.error('Required path parameter id is missing.', 400)
    }

    const [dog, error] = await dogService.getDogById(req.params.id);

    if (error) {
        return res.error('Resource you were requesting does not exist', 404)
    }

    res.sendJson(dog)
}

export async function createDog(req: ServerRequest, res: NodeResponse) {

    const newDog = req.body

    const [id, error] = await dogService.createDog(newDog)

    if(error){
        return res.error('Could not add dog due to error: ' + error, 404)
    }

    res.sendJson({id})
}

export async function deleteDog(req: ServerRequest, res: NodeResponse) {
    
    const error = await dogService.deleteDog(req.params.id)
    
    if(error){
       return res.error('Resource you were requesting does not exist', 404)
    }

    res.ok()
}