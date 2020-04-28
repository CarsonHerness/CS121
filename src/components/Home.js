import React from 'react';
import RecipeSearchItem from './RecipeSearchItem';
import { CardDeck, Container, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

class Home extends React.Component {

    constructor(props) {
        super(props);

        //Create local state to store search terms and results
        this.state = {
            searchName: '',
            searchIngredients: '',
            excludeIngredients: '',
            filteredRecipes: this.props.recipes
        };

        this.handleNameSearch = this.handleNameSearch.bind(this);
        this.updateNameText = this.updateNameText.bind(this);
        this.handleIngredientsSearch = this.handleIngredientsSearch.bind(this);
        this.updateIngredientsText = this.updateIngredientsText.bind(this);
        this.filterExcludedIngredients = this.filterExcludedIngredients.bind(this);
        this.updateExcludeIngredientsText = this.updateExcludeIngredientsText.bind(this);
    }

    //This method is used in each type of search
    //so that the excluded ingredients are always excluded from search results.
    filterExcludedIngredients(recipeList) {

        if (this.state.excludeIngredients !== '') {

            let excludeIngredientsList = this.state.excludeIngredients.split(" ");

            recipeList = recipeList.filter(recipe => {
                let hasIngredients = true;
                //Check whether each ingredient is present in given recipe, and if it is, exclude it
                for (let index = 0; index < excludeIngredientsList.length; index++) {
                    let excludedIngredient = excludeIngredientsList[index];
                    hasIngredients = hasIngredients && (recipe.ingredientsList
                        .filter(ingredient => ingredient.toLowerCase().indexOf(excludedIngredient.toLowerCase()) !== -1).length == 0);
                }
                return hasIngredients;
            });
        }
        return recipeList;
    }

    //Allows excluded ingredients text to update when user types
    updateExcludeIngredientsText(event) {

        this.setState({ excludeIngredients: event.target.value });
    }

    //Allows search bar text to update when user types
    updateNameText(event) {

        this.setState({ searchName: event.target.value });
    }

    handleNameSearch(event) {

        event.preventDefault();

        if (this.props.recipes && this.state.searchName !== '') {

            let newFilteredRecipes = null;

            newFilteredRecipes = this.props.recipes.filter(recipe => {
                return recipe.name.toLowerCase().indexOf(this.state.searchName.toLowerCase()) !== -1;
            });

            newFilteredRecipes = this.filterExcludedIngredients(newFilteredRecipes);
            this.setState({ filteredRecipes: newFilteredRecipes });
        }
    }

    //Allows search bar text to update when user types
    updateIngredientsText(event) {

        this.setState({ searchIngredients: event.target.value });
    }

    handleIngredientsSearch(event) {
        event.preventDefault();

        if (this.props.recipes && this.state.searchIngredients !== '') {
            let newFilteredRecipes = null;
            let searchIngredientsList = this.state.searchIngredients.split(" ");
            newFilteredRecipes = this.props.recipes.filter(recipe => {
                let hasIngredients = true;
                //Check whether each ingredient is present in given recipe
                for (let index = 0; index < searchIngredientsList.length; index++) {
                    let searchedIngredient = searchIngredientsList[index];
                    hasIngredients = hasIngredients && (recipe.ingredientsList
                        .filter(ingredient => ingredient.toLowerCase().indexOf(searchedIngredient.toLowerCase()) !== -1).length !== 0);
                }
                return hasIngredients;
            });
            newFilteredRecipes = this.filterExcludedIngredients(newFilteredRecipes);
            this.setState({ filteredRecipes: newFilteredRecipes });
        }
    }



    render() {
        //Get search terms and recipes from state
        const { searchName, searchIngredients, excludeIngredients, filteredRecipes } = this.state;

        return (
            <div className="App">
                <body className="App-body">

                    <Container>
                        <Row>
                            <Col>
                                <form onSubmit={this.handleNameSearch}>
                                    <label>
                                        Search by recipe name:
              <input type="text" name="name" value={searchName} onChange={this.updateNameText} />
                                    </label>
                                    <input type="submit" value="Submit" />
                                </form>
                            </Col>

                            <Col>
                                <form onSubmit={this.handleIngredientsSearch}>
                                    <label>
                                        Search by ingredients (must include):
              <input type="text" name="name" value={searchIngredients} onChange={this.updateIngredientsText} />
                                    </label>
                                    <input type="submit" value="Submit" />
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <form onSubmit={this.handleNameSearch}>
                                    <label>
                                        Exclude ingredients:
              <input type="text" name="name" value={excludeIngredients} onChange={this.updateExcludeIngredientsText} />
                                    </label>
                                </form>
                            </Col>
                        </Row>
                    </Container>
                    <CardDeck>
                        {/* Only do map if recipes exist, and only display searched recipes. */}
                        {filteredRecipes && filteredRecipes.map(recipe => {
                            return (
                                // Create a RecipeSearchItem for each recipe.
                                <RecipeSearchItem recipe={recipe} key={recipe.id}></RecipeSearchItem>
                            )
                        })}
                    </CardDeck>
                </body>
            </div>
        );
    }
}

// mapStateToProps tells connect what data to retrieve from the store
const mapStateToProps = (state) => {
    console.log(state);
    return {
        // Attach the recipe property from STATE's rootReducer
        //   which in turn has a recipes property from the projectReducer
        //   to a recipes property inside the PROPS of this component
        recipes: state.firestore.ordered.recipes
    }
}

// Connect gets data from the store
export default compose(firestoreConnect(['recipes']), connect(mapStateToProps))(Home)
