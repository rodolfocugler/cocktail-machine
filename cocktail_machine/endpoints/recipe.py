import logging

from flask_restx import fields, Namespace, Resource

from cocktail_machine import config
from cocktail_machine.services import recipe_service

api = Namespace('recipes')

conf = config.Config()

model = api.model('Recipe', {
    'idDrink': fields.String(),
    'strDrink': fields.String(required=True),
    'strTags': fields.String(),
    'strCategory': fields.String(),
    'strIBA': fields.String(),
    'strAlcoholic': fields.String(),
    'strGlass': fields.String(),
    'strInstructions': fields.String(),
    'strDrinkThumb': fields.String(),
    'strIngredient1': fields.String(required=True),
    'strIngredient2': fields.String(),
    'strIngredient3': fields.String(),
    'strIngredient4': fields.String(),
    'strIngredient5': fields.String(),
    'strIngredient6': fields.String(),
    'strIngredient7': fields.String(),
    'strIngredient8': fields.String(),
    'strIngredient9': fields.String(),
    'strIngredient10': fields.String(),
    'strIngredient11': fields.String(),
    'strIngredient12': fields.String(),
    'strIngredient13': fields.String(),
    'strIngredient14': fields.String(),
    'strIngredient15': fields.String(),
    'strMeasure1': fields.String(required=True),
    'strMeasure2': fields.String(),
    'strMeasure3': fields.String(),
    'strMeasure4': fields.String(),
    'strMeasure5': fields.String(),
    'strMeasure6': fields.String(),
    'strMeasure7': fields.String(),
    'strMeasure8': fields.String(),
    'strMeasure9': fields.String(),
    'strMeasure10': fields.String(),
    'strMeasure11': fields.String(),
    'strMeasure12': fields.String(),
    'strMeasure13': fields.String(),
    'strMeasure14': fields.String(),
    'strMeasure15': fields.String(),
    'strImageSource': fields.String(),
    'strImageAttribution': fields.String()
})


@api.route('/recipes')
class RecipeList(Resource):

    def get(self):
        logging.debug(f'get recipes')
        return recipe_service.get()

    @api.expect(model)
    def post(self):
        logging.debug(f'creating a recipe {api.payload}')
        return recipe_service.post(api.payload)


@api.route('/recipes/<int:_id>')
class Recipes(Resource):

    def get(self, _id):
        logging.debug(f'get recipe {_id}')
        return recipe_service.get_by_id(_id)

    @api.expect(model)
    def put(self, _id):
        logging.debug(f'put recipe {_id}')
        return recipe_service.put(_id, api.payload)

    def delete(self, _id):
        logging.debug(f'delete recipe {_id}')
        recipe_service.delete(_id)
