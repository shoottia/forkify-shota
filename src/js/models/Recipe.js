import axios from 'axios'

export default class Recipe {
    constructor(id){
       this.id = id;
    } 

    async getRecipe(){
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`); 
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert(error);
        }
    };

    calacTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    calcServings(){
        this.servings = 4;
    };

    parseIngredients(){
          
       const newIngredients = this.ingredients.map(el => {
        const unitsLong = ['tablespons', 'tab;espoon', 'ounce', 'teaspoons', 'teaspoon', 'cups'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup'];
        const units = [...unitsShort, 'kg', 'g', 'pound'];

       // 1) uniform unit 
       let ingredient = el.toLowerCase();
       unitsLong.forEach((unit, i) => {
           ingredient = ingredient.replace(unit, unitsShort[i]);
       });
       // 2) remove paranetheses
       ingredient = ingredient.replace(/ *\(([^)]*)\) */g, ' ');

       // 3) parse ingredients into count, unit and ingredient
       const arrIng = ingredient.split(' ');
       const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

        let objIng;
       if(unitIndex > -1){
           //there is a unit 
        const arrCount = arrIng.slice(0,unitIndex);  

        let count;
        if (arrCount.length === 1) {
            count = eval(arrIng[0]);  
        }else{
            count = eval(arrCount.join('+'));
        }

        objIng  = {
           count,
           unit: arrIng[unitIndex],
           ingredient: arrIng.slice(unitIndex + 1).join(' '),
        }

        }else if(parseInt(arrIng[0],10)){
           //there is no unit, but number  

           objIng = {
               count: parseInt(arrIng[0],10),
               unit: ' ',
               ingredient: arrIng.slice(1).join(' ')  
           }

       }else if(unitIndex === -1){
           //there is no unit
           objIng = {
            count: 1,
            unit: '',
            ingredient
           };

       }
       
       return objIng;
       }); 

       this.ingredients = newIngredients;   
    }
}