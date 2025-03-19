import React, {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams} from "react-router-dom";
import SidebarMenu from "../../components/SidebarMenu";
import {ButtonDiv, Container, RemoveButton, Wrapper} from "./styles";
import queryString from "querystring";
import {AiOutlineReload} from "react-icons/ai";
import colors from "../../utils/colors";
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {toast} from "react-toastify";

function Recipe() {
  const params = useParams()
  const {search} = useLocation();
  const history = useHistory()
  const [drink, setDrink] = useState({strIngredient: []});
  const [loading, setLoading] = useState(true);

  const onDelete = async () => {
    if (params.id) {
      await cocktailMachineApi(search).delete(`/drinks/${params.id}`)
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
      history.push("/?strCategory=Custom Recipes");
    }
  }

  const onSave = async () => {
    const d = {...drink};
    d.strIngredient.map((i, index) => {
      return {...i, order: index}
    })
    setDrink(d);

    if (parseInt(params.id) === 0) {
      await cocktailMachineApi(search).post(`/drinks`, JSON.stringify(drink))
        .then((response) => {
          toast.success("Recipe saved", {position: toast.POSITION.BOTTOM_RIGHT});
          history.push(`/recipe/${response.data.id}?domain=${getDomain(search)}`);
        })
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    } else {
      await cocktailMachineApi(search).put(`/drinks/${params.id}`, JSON.stringify(drink))
        .then(() => toast.success("Recipe saved", {position: toast.POSITION.BOTTOM_RIGHT}))
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    }
  }

  const onAddIngredient = () => {
    const d = {...drink};
    d.strIngredient.push({order: d.strIngredient.length + 1});
    setDrink(d);
  }

  async function loadDrink(drinkId, deleteId) {
    let response = await cocktailMachineApi(search).get(`/drinks/${drinkId}`);
    if (deleteId) delete response.data.id;
    setDrink(response.data);
    setLoading(false);
  }

  useEffect(() => {
    const query = queryString.parse(search.replace("?", ""))
    setLoading(true);
    if (!!query.ref) {
      loadDrink(query.ref, true);
    } else if (parseInt(params.id) !== 0) {
      loadDrink(params.id);
    } else {
      setLoading(false);
    }
  }, []);

  const updateDrink = (field, value) => {
    const d = {...drink};
    d[field] = value;
    setDrink(d);
  }

  const updateMeasure = (isUnit, index, value) => {
    if (isUnit || /^([0-9](\.|\s|\/)*)+$/.test(value) || value === "") {
      const d = {...drink};
      d.strIngredient[index].strMeasure = isUnit ?
        `${getMeasure(!isUnit, d.strIngredient[index].strMeasure)} ${value}` :
        `${value} ${getMeasure(!isUnit, d.strIngredient[index].strMeasure)}`;
      setDrink(d);
    }
  }

  const updateIngredient = (index, value) => {
    const d = {...drink};
    d.strIngredient[index].strIngredient = value;
    setDrink(d);
  }

  const getMeasure = (isUnit, measure) => {
    let value = "";
    if (!!measure) {
      const regex = isUnit ? measure.match(/[a-zA-Z]+/) : measure.match(/[^a-z]+/)
      value = !!regex ? regex.join("").trim() : "";
    }

    return value;
  }

  const onRemove = (index) => {
    const d = {...drink};
    d.strIngredient.splice(index, 1);
    d.strIngredient.forEach((value, index) => value.order = index + 1);
    setDrink(d);
  }

  return (<>
    <Wrapper>
      <SidebarMenu
        selected={"Recipes"}
        onSelect={(value) => {
          if (value !== "Recipes" && value !== "") history.push(`/?strCategory=${value}&domain=${getDomain(search)}`);
        }}
      />
      <Container>
        {loading ? (<AiOutlineReload
          className="loading"
          size={100}
          color={colors.primaryColor}
        />) : (<>
          <label>
            Name:
            <input
              required={true}
              type="text"
              name="name"
              placeholder="Name"
              value={drink.strDrink}
              onChange={(e) => updateDrink("strDrink", e.target.value)}
            />
          </label>

          <label>
            Tags:
            <input
              type="text"
              name="tags"
              placeholder="Tags"
              value={!!drink.strTags ? drink.strTags : ""}
              onChange={(e) => updateDrink("strTags", e.target.value)}
            />
          </label>

          <label>
            Category:
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={!!drink.strCategory ? drink.strCategory : ""}
              onChange={(e) => updateDrink("strCategory", e.target.value)}
            />
          </label>

          <label>
            IBA:
            <input
              type="text"
              name="iba"
              placeholder="IBA"
              value={!!drink.strIBA ? drink.strIBA : ""}
              onChange={(e) => updateDrink("strIBA", e.target.value)}
            />
          </label>

          <label>
            Alcoholic:
            <input
              required={true}
              type="text"
              name="alcoholic"
              placeholder="Alcoholic"
              value={!!drink.strAlcoholic ? drink.strAlcoholic : ""}
              onChange={(e) => updateDrink("strAlcoholic", e.target.value)}
            />
          </label>

          <label>
            Glass:
            <input
              type="text"
              name="glass"
              placeholder="Glass"
              value={!!drink.strGlass ? drink.strGlass : ""}
              onChange={(e) => updateDrink("strGlass", e.target.value)}
            />
          </label>

          <label>
            Instructions:
            <input
              type="text"
              name="instructions"
              placeholder="Instructions"
              value={!!drink.strInstructions ? drink.strInstructions : null}
              onChange={(e) => updateDrink("strInstructions", e.target.value)}
            />
          </label>

          <label>
            DrinkThumb:
            <input
              type="text"
              name="drinkThumb"
              placeholder="Drink Thumb"
              value={!!drink.strDrinkThumb ? drink.strDrinkThumb : ""}
              onChange={(e) => updateDrink("strDrinkThumb", e.target.value)}
            />
          </label>


          <ButtonDiv>
            <button type={"button"} onClick={onAddIngredient}>Add</button>
          </ButtonDiv>

          {drink.strIngredient.map((ingredient, index) => (
            <div key={index} className={"ingredient"}>
              <label>
                Ingredient {index + 1}:
                <input
                  required={index === 0}
                  type="text"
                  name={`strIngredient${index + 1}`}
                  placeholder={`Ingredient ${index + 1}`}
                  value={!!ingredient.strIngredient ? ingredient.strIngredient : ""}
                  onChange={(e) => updateIngredient(index, e.target.value, index)}
                />
              </label>

              <label>
                Measure {index + 1}:
                <input
                  required={index === 0}
                  type="text"
                  name={`strMeasure${index + 1}`}
                  placeholder={`Measure ${index + 1}`}
                  value={getMeasure(false, ingredient.strMeasure)}
                  onChange={(e) => updateMeasure(false, index, e.target.value)}
                />
              </label>

              <label>
                Unit {index + 1}:
                <select
                  required={index === 0}
                  name={`unit${index + 1}`}
                  placeholder={`Unit ${index + 1}`}
                  value={getMeasure(true, ingredient.strMeasure)}
                  onChange={(e) => updateMeasure(true, index, e.target.value)}
                >
                  <option value={""}></option>
                  <option value={"ml"}>ml</option>
                  <option value={"cl"}>cl</option>
                  <option value={"oz"}>oz</option>
                  <option value={"cup"}>cup</option>
                  <option value={"cups"}>cups</option>
                  <option value={"shot"}>shot</option>
                  <option value={"shots"}>shots</option>
                  <option value={"part"}>part</option>
                  <option value={"parts"}>parts</option>
                  <option value={"leaf"}>leaf</option>
                  <option value={"leaves"}>leaves</option>
                  <option value={"tblsp"}>tblsp</option>
                  <option value={"dash"}>dash</option>
                  <option value={"dashes"}>dashes</option>
                </select>
              </label>

              <RemoveButton>
                <button type={"button"} onClick={() => onRemove(index)}>Remove</button>
              </RemoveButton>
            </div>
          ))}

          <label>
            Image Source:
            <input
              type="text"
              name="imageSource"
              placeholder="Image Source"
              value={!!drink.strImageSource ? drink.strImageSource : ""}
              onChange={(e) => updateDrink("strImageSource", e.target.value)}
            />
          </label>

          <label>
            Image Attribution:
            <input
              type="text"
              name="imageAttribution"
              placeholder="Image Attribution"
              value={!!drink.strImageAttribution ? drink.strImageAttribution : ""}
              onChange={(e) => updateDrink("strImageAttribution", e.target.value)}
            />
          </label>
        </>)}

        <ButtonDiv>
          {parseInt(params.id) !== 0 && <button type={"button"} onClick={onDelete}>Delete</button>}
          <button type={"button"} onClick={onSave}>Save</button>
        </ButtonDiv>
      </Container>
    </Wrapper>
  </>);
}

export default Recipe;
