import React, {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams} from "react-router-dom";
import SidebarMenu from "../../components/SidebarMenu";
import {ButtonDiv, Container, Wrapper} from "./styles";
import queryString from "querystring";
import api from "../../services/api";
import {AiOutlineReload} from "react-icons/ai";
import colors from "../../utils/colors";
import cocktailMachineApi, {getDomain} from "../../services/cocktail-machine-api";
import {toast} from "react-toastify";

function Recipe() {
  const params = useParams()
  const {search} = useLocation();
  const history = useHistory()
  const [ drink, setDrink ] = useState({});
  const [ loading, setLoading ] = useState(true);

  const onDelete = async () => {
    if (params.id) {
      await cocktailMachineApi(search).delete(`/recipes/${params.id}`)
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
      history.push("/?strCategory=Custom Recipes");
    }
  }

  const onSave = async () => {
    if (parseInt(params.id) === 0) {
      await cocktailMachineApi(search).post(`/recipes`, JSON.stringify(drink))
        .then((response) => {
          toast.success("Recipe saved", {position: toast.POSITION.BOTTOM_RIGHT});
          history.push(`/recipe/${response.data.idDrink}`);
        })
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    } else {
      await cocktailMachineApi(search).put(`/recipes/${params.id}`, JSON.stringify(drink))
        .then(() => toast.success("Recipe saved", {position: toast.POSITION.BOTTOM_RIGHT}))
        .catch((e) => toast.error(e.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT}));
    }
  }

  async function loadDrink(type, drinkId) {
    let response = {};
    if (type === 1) {
      response = await api.get('lookup.php', {params: {i: drinkId}});
      response = response.data.drinks[0];
    } else if (parseInt(params.id) !== 0) {
      response = await cocktailMachineApi(search).get(`/recipes/${drinkId}`);
      response = response.data.drinks[0];
    }
    setDrink(response);
    setLoading(false);
  }

  useEffect(() => {
    const query = queryString.parse(search.replace("?", ""))
    setLoading(true);
    if (!!query.ref) {
      loadDrink(1, query.ref);
    } else {
      loadDrink(2, params.id);
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
      d[`strMeasure${index + 1}`] = isUnit ? `${getMeasure(!isUnit, index)} ${value}` : `${value} ${getMeasure(!isUnit, index)}`;
      setDrink(d);
    }
  }

  const getMeasure = (isUnit, index) => {
    const measure = drink[`strMeasure${index + 1}`];
    let value = "";
    if (!!measure) {
      const regex = isUnit ? measure.match(/[a-zA-Z]+/) : measure.match(/[^a-z]+/)
      value = !!regex ? regex.join("").trim() : "";
    }

    return value;
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

          {Array.from(Array(15).keys()).map(index => (
            <div key={index} className={"ingredient"}>
              <label>
                Ingredient {index + 1}:
                <input
                  required={index === 0}
                  type="text"
                  name={`ingredient${index + 1}`}
                  placeholder={`Ingredient ${index + 1}`}
                  value={!!drink[`strIngredient${index + 1}`] ? drink[`strIngredient${index + 1}`] : ""}
                  onChange={(e) => updateDrink(`strIngredient${index + 1}`, e.target.value)}
                />
              </label>

              <label>
                Measure {index + 1}:
                <input
                  required={index === 0}
                  type="text"
                  name={`measure${index + 1}`}
                  placeholder={`Measure ${index + 1}`}
                  value={getMeasure(false, index)}
                  onChange={(e) => updateMeasure(false, index, e.target.value)}
                />
              </label>

              <label>
                Unit {index + 1}:
                <select
                  required={index === 0}
                  name={`unit${index + 1}`}
                  placeholder={`Unit ${index + 1}`}
                  value={getMeasure(true, index)}
                  onChange={(e) => updateMeasure(true, index, e.target.value)}
                >
                  <option value={""}></option>
                  <option value={"ml"}>ml</option>
                  <option value={"cl"}>cl</option>
                  <option value={"oz"}>oz</option>
                  <option value={"shot"}>shot</option>
                  <option value={"part"}>part</option>
                  <option value={"leaves"}>leaves</option>
                  <option value={"tblsp"}>tblsp</option>
                  <option value={"dash"}>dash</option>
                </select>
              </label>
            </div>))}

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
