import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RecipeService } from '../recipes/recipe.service';

@Injectable()
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipesService: RecipeService) {}

  saveRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://angular-recipe-book-a95a6.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log('PUT response => ', response);
      });
  }
}
