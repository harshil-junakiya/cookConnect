import express from "express"
import Recipe from "../models/Recipe.js"
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            steps,
            user: req.user.id
        })
        await newRecipe.save()
        res.status(201).json({ success: true, message: "Recipe Created Successfully" })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

router.get("/", async (req, res) => {
    try {
        const recipes = await Recipe.find().populate("user", "name")
        res.json(recipes)
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate("User", "name")
        if (!recipe) return res.status(404).json({ success: false, message: "Recipe not found" })
        res.json(recipe)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
        if (!recipe) return res.status(404).json({ message: "Recipe not found" })

        if (recipe.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        Object.assign(recipe, req.body);
        await recipe.save();
        res.json({ message: "Recipe updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


router.delete("/:id", authMiddleware, async(req, res)=> {
    try {
        const recipe = await Recipe.findById(req.params.id)
        if(!recipe) return res.status(404).json({message: "Recipe not found!"})
        
        if(recipe.user.toString()!= req.user.id){
            return res.status(403).json({message: "Unauthorized"})
        }
        await recipe.deleteOne()
        res.json({
            message: "Recipe deleted Successfully!!"
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

export default router