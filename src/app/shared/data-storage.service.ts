import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap  } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipesService: RecipeService,
              private authService: AuthService) {}

  saveRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put('https://angular-recipe-book-a95a6.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log('PUT response => ', response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>('https://angular-recipe-book-a95a6.firebaseio.com/recipes.json')
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      })
    );
  }
}
