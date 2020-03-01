import React from 'react';
 
class Recipe extends React.Component {
    render() {
        // only display a recipe if a recipe has been chosen
        if (this.props.recipe !== undefined) {
            return (
                <div>
                   <h1>{this.props.recipe.name}</h1>
                   <p>{this.props.recipe.instructions}</p>
                </div>
             );
        } else {
            return (
                <h1> Please select a recipe. </h1>
            );
        }
    }
}
 
export default Recipe;