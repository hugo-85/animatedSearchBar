import React, { useState } from "react";
import "./App.css";
import Downshift, { resetIdCounter } from "downshift";
import debounce from "lodash.debounce";
import axios from "axios";
import { useSpring, animated as a } from "react-spring";

function App() {
  const [searchedItems, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const goToItem = (item) => {
    console.log("item selected", item);
  };

  const onChange = debounce((e) => {
    setLoading({ loading: true });
    setTimeout(() => {
      axios.get("./movies.json").then((res) => {
        const result = res.data;
        var items_res = result.movies.filter((item) =>
          item.field_display_title
            .toUpperCase()
            .includes(e.target.value.toUpperCase())
        );
        setItems(items_res);
        setLoading(false);
      });
    }, 3000);
  }, 350);
  resetIdCounter();

  const [flipped, setFlipped] = useState(true);
  const { transform, opacity, opacity2, width, width2, display } = useSpring({
    opacity: flipped ? 0 : 1,
    opacity2: flipped ? 1 : 0,
    width: flipped ? "0%" : "80%",
    width2: flipped ? "30%" : "0%",
    transform: `perspective(0px) rotate(${flipped ? 0 : 360}deg)`,
    display: flipped ? 0 : 1,
    config: { mass: 5, tension: 500, friction: 200 },
  });

  return (
    <div className="App">
      <a.div
        className="search-wrapper"
        style={{ width: width, opacity: opacity, display: display }}
      >
        <Downshift
          onChange={(e) => goToItem(e)}
          itemToString={(item) =>
            item === null ? "" : item.field_display_title
          }
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
          }) => (
            <div>
              <input
                {...getInputProps({
                  type: "text",
                  placeholder: "Search For A Movie",
                  id: "search",
                  className: loading ? "loading" : "searchBar",
                  onChange: (e) => {
                    e.persist();
                    onChange(e);
                  },
                })}
              />
              {isOpen && !loading && (
                <div className="drop-down">
                  {searchedItems.map((item, index) => (
                    <div
                      className="drop-down-item"
                      {...getItemProps({ item })}
                      key={item.nid}
                    >
                      <img
                        width="50"
                        src={item.field_title_thumbnail.src}
                        alt={item.field_title_thumbnail.alt}
                      />
                      {item.field_display_title}
                    </div>
                  ))}
                  {!searchedItems.length && !loading && (
                    <div className="drop-down-item">
                      Nothing Found For {inputValue}{" "}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Downshift>
      </a.div>
      <a.span
        className="head-line"
        style={{ opacity: opacity2, display: display, width: width2 }}
      >
        {flipped && "Want to see a movie!..."}
      </a.span>
      <button className="search-button" onClick={() => setFlipped(!flipped)}>
        <a.span
          className="material-icons search-button-icon"
          style={{ transform: transform, opacity: opacity2 }}
        >
          search
        </a.span>
        <a.span
          className="material-icons"
          style={{ transform: transform, opacity: opacity }}
        >
          close
        </a.span>
      </button>
    </div>
  );
}

export default App;

/*
 <a.input
        className="searchBar"
        type="text"
        placeholder="Search For A Movie 2"
        style={{ width: width, opacity: opacity2 }}
      />
*/
