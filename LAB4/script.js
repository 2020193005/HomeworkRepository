window.onload = function () {
  fetch("product.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      init_json(json);
    })
    .catch((err) => console.error(`Fetch problem : ${err.message}`));

  function init_json(products) {
    const category = document.querySelector("#food-categories");
    const keyword = document.querySelector("#search-keyword");
    const sort = document.querySelector("#price-sort");
    const filter_button = document.querySelector("#filter_button");
    const show = document.querySelector("#show");
    let category_filtered = null;
    let keyword_filtered = null;
    let sort_filtered = products;

    display_products();

    filter_button.addEventListener("click", select_category);

    function select_category(event) {
      event.preventDefault();

      category_filtered = null;
      keyword_filtered = null;
      sort_filtered = null;

      if (category.value.toLowerCase() === "all") {
        category_filtered = products;
      } else {
        category_filtered = products.filter((product) => {
          return product.category === category.value.toLowerCase();
        });
      }

      select_keyword();
    }

    function select_keyword() {
      if (keyword.value.trim() === "") {
        keyword_filtered = category_filtered;
      } else {
        keyword_filtered = category_filtered.filter((product) => {
          return (
            product.category === keyword.value.trim().toLowerCase() ||
            product.name.toLowerCase() === keyword.value.trim().toLowerCase()
          );
        });
      }

      sort_products();
    }

    function sort_products() {
      let list = [];
      for (var product in keyword_filtered) {
        list.push(keyword_filtered[product]);
      }
      if (sort.value.toLowerCase() === "up") {
        list.sort(function (a, b) {
          return a["price"] - b["price"];
        });
      } else if (sort.value.toLowerCase() === "down") {
        list.sort(function (a, b) {
          return b["price"] - a["price"];
        });
      }
      sort_filtered = list;
      display_products();
    }

    function display_products() {
      let start = 0;
      let end = Math.min(start + 9, sort_filtered.length);

      while (show.firstChild) {
        show.removeChild(show.firstChild);
      }

      load();

      window.addEventListener("scroll", () => {
        const end_of_page =
          window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
        if (end_of_page) {
          start = end;
          end = Math.min(start + 2, sort_filtered.length);
          load();
        }
      });

      function load() {
        for (var i = start; i < end; i++) {
          const filtered_product = sort_filtered[i];
          const div = document.createElement("div");
          const img = document.createElement("img");
          div.id = filtered_product.name;
          if (document.querySelector(`#${filtered_product.name}`) == null) {
            div.className = "products";
            div.addEventListener("click", function (event) {
              event.preventDefault();
              display_info(filtered_product, div, img);
            });
            img.src = `images/${filtered_product.link}`;
            img.alt = `${filtered_product.name}`;
            div.appendChild(img);
            show.appendChild(div);
          }
        }

        function display_info(filtered_product, div, img) {
          img.style.filter = "brightness(30%)";
          const inner_div = document.createElement("div");
          const p_name = document.createElement("p");
          const p_price = document.createElement("p");
          const p_origin = document.createElement("p");
          inner_div.className = "inner-div";
          p_name.innerText = "Product : " + filtered_product.name;
          p_price.innerText = "Price : $" + filtered_product.price;
          p_origin.innerText = "Origin : " + filtered_product.origin;
          inner_div.appendChild(p_name);
          inner_div.appendChild(p_price);
          inner_div.appendChild(p_origin);
          div.appendChild(inner_div);
        }
      }
    }
  }
};
