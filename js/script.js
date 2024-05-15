// JavaScript
const goTopBtn = document.querySelector(".go--top");

// Показываем или скрываем кнопку при скролле
window.addEventListener("scroll", function() {
    if (window.pageYOffset > 250) {
        goTopBtn.style.display = "block";
    } else {
        goTopBtn.style.display = "none";
    }
});

// Плавная прокрутка вверх при нажатии на кнопку
goTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
// Создаем массив с названиями регионов
var regions = ["Минск", "Брест", "Гродно", "Витебск", "Могилев", "Гомель"];

// Получаем кнопку и элемент для отображения выбранного региона
var button = document.querySelector(".content__menu__location__button");
var title = document.querySelector(".content__menu__location__title");

// Устанавливаем сохраненный регион при загрузке страницы
var savedRegion = localStorage.getItem('selectedRegion');
if (savedRegion) {
  title.textContent = savedRegion;
}

// Создаем выпадающее меню с регионами
var dropdown = document.createElement("div");
dropdown.className = 'content__menu__location__dropdown';
dropdown.style.zIndex = '1';

for (let i = 0; i < regions.length; i++) {
  let region = document.createElement("p");
  region.textContent = regions[i];
  region.style.cursor = "pointer";
  region.onmouseover = function() {
    this.style.backgroundColor = "#ffc465"; 
  };
  region.onmouseout = function() {
    this.style.backgroundColor = "transparent"; // Возвращаем прозрачный фон при убирании курсора
  };
  region.onclick = function() {
    title.textContent = this.textContent;
    dropdown.style.display = "none";
    // Сохраняем выбранный регион
    localStorage.setItem('selectedRegion', this.textContent);
    // Возвращаем изображение в исходное положение
    buttonImage.style.transform = "rotate(0deg)";
  };
  dropdown.appendChild(region);
}

document.body.appendChild(dropdown);

// Получаем изображение внутри кнопки
var buttonImage = document.querySelector(".content__menu__location__button img");

// Показываем или скрываем выпадающее меню при клике на кнопку
button.onclick = function(e) {
  if (dropdown.style.display === "none") {
    dropdown.style.display = "block";
    var buttonLeft = button.offsetLeft; // Получаем смещение кнопки относительно левого края
    var buttonWidth = button.offsetWidth; // Получаем ширину кнопки
    dropdown.style.top = (button.offsetTop + button.offsetHeight - 50.5) + "%";
    dropdown.style.left = (buttonLeft - dropdown.offsetWidth + buttonWidth + 56) + "%"; // Смещаем влево на ширину выпадающего меню
    // Поворачиваем изображение на 90 градусов
    buttonImage.style.transform = "rotate(90deg)";
  } else {
    dropdown.style.display = "none";
    // Возвращаем изображение в исходное положение
    buttonImage.style.transform = "rotate(0deg)";
  }
};

// Получаем изображение внутри кнопки
var buttonImage = document.querySelector(".content__menu__location__button img");

// Устанавливаем z-index для изображения больше, чем у выпадающего окна
buttonImage.style.position = 'relative'; // z-index работает только для элементов с ненулевым значением свойства position

document.addEventListener("DOMContentLoaded", function() {
  $('.multiple-items').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3
  });
});
$(document).ready(function(){
  $('.content__popular__slider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});


document.addEventListener("DOMContentLoaded", function() {
  fetch('../xml/catalog.xml')
  .then(response => response.text())
  .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const products = xmlDoc.getElementsByTagName('product');
  
      const catalogDiv = document.getElementById('catalog');
      for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const name = product.getElementsByTagName('name')[0].textContent;
          const price = product.getElementsByTagName('price')[0].textContent;
          const weight = product.getElementsByTagName('weight')[0].textContent;
          const width = product.getElementsByTagName('width')[0].textContent;
          const length = product.getElementsByTagName('length')[0].textContent;
          const NoFrost = product.getElementsByTagName('NoFrost')[0].textContent;
          const height = product.getElementsByTagName('height')[0].textContent;
          const color = product.getElementsByTagName('color')[0].textContent;
          const freshnessZone = product.getElementsByTagName('FreshnessZone')[0].textContent;
          const image = product.getElementsByTagName('image')[0].textContent;
  
          const productBlock = `
              <div class="product">
                  <img class="product__img" src="${image}" alt="${name}">
                  <h2>${name}</h2>
                  <ul>
                      <li>${weight}</li>
                      <li>${width}</li>
                      <li>${length}</li>
                      <li>${height}</li>
                      <li>${NoFrost}</li>
                      <li>${color}</li>
                      <li>${freshnessZone}</li>
                  </ul>
                  <p>${price}</p>
                  <button class="catalog__buy--button">в корзину</button>
              </div>
          `;
          catalogDiv.innerHTML += productBlock;
      }
  
      // Добавляем обработчик событий для кнопок "В корзину"
      const buyButtons = document.querySelectorAll('.catalog__buy--button');
      buyButtons.forEach(button => {
          button.addEventListener('click', () => {
              // Здесь можно добавить логику для обработки нажатия на кнопку "В корзину"
          });
      });
  })
  .catch(error => console.error('Error fetching XML:', error));
});


function searchButtonClick() {
  search();
}



// Функция поиска
function search() {
  const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
  if (searchText === "") return; // Проверка: если поле ввода пусто, прекратить выполнение функции

  const searchResults = [];

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          const xmlDoc = this.responseXML;
          const products = xmlDoc.getElementsByTagName("product");

          for (let i = 0; i < products.length; i++) {
              const productName = products[i].getElementsByTagName("name")[0].textContent.toLowerCase();
              if (isSubstring(searchText, productName)) {
                  searchResults.push(products[i]);
              }
          }

          displaySearchResults(searchResults);
          hideSlider(searchResults.length > 0); // Скрыть слайдер, если есть результаты поиска
      }
  };
  xhttp.open("GET", "xml/catalog.xml", true);
  xhttp.send();
}

// Функция, вызываемая при нажатии на кнопку "Очистить"
function clearSearch() {
  document.getElementById("searchInput").value = ""; // Очистить поле ввода
  document.getElementById("searchResults").innerHTML = ""; // Очистить результаты поиска
  hideSlider(false);
}

// Функция проверки, является ли строка searchSub подстрокой строки str
function isSubstring(searchSub, str) {
  searchSub = searchSub.replace(/\s+/g, ''); // Убрать пробелы из поисковой подстроки
  let index = 0;
  for (let char of str) {
      if (char === searchSub[index]) {
          index++;
      }
      if (index === searchSub.length) {
          return true;
      }
  }
  return false;
}

function displaySearchResults(results) {
  const searchResultsDiv = document.getElementById("searchResults");
  searchResultsDiv.innerHTML = "";

  if (results.length === 0) {
      searchResultsDiv.innerHTML = '<p class="nothing">Ничего не найдено</p>';
  } else {
      for (let i = 0; i < results.length; i++) {
          const product = results[i];
          const productNameElement = product.getElementsByTagName("name")[0];
          if (productNameElement) {
              const productName = productNameElement.textContent;
              const productLink = 'index-page.html?'; // Базовая часть ссылки

              // Собираем все параметры и добавляем к ссылке
              const params = new URLSearchParams();

              // Проверяем наличие каждого тега и добавляем его к параметрам, если он существует
              const nameElement = product.getElementsByTagName('name')[0];
              if (nameElement) params.append('name', nameElement.textContent);

              const priceElement = product.getElementsByTagName('price')[0];
              if (priceElement) params.append('price', priceElement.textContent);

              const weightElement = product.getElementsByTagName('weight')[0];
              if (weightElement) params.append('weight', weightElement.textContent);

              const lengthElement = product.getElementsByTagName('length')[0];
              if (lengthElement) params.append('length', lengthElement.textContent);

              const heightElement = product.getElementsByTagName('height')[0];
              if (heightElement) params.append('height', heightElement.textContent);

              const colorElement = product.getElementsByTagName('color')[0];
              if (colorElement) params.append('color', colorElement.textContent);

              const NoFrostElement = product.getElementsByTagName('NoFrost')[0];
              if (NoFrostElement) params.append('NoFrost', NoFrostElement.textContent);

              const freshnessZoneElement = product.getElementsByTagName('freshnessZone')[0];
              if (freshnessZoneElement) params.append('freshnessZone', freshnessZoneElement.textContent);

              const motorTypeElement = product.getElementsByTagName('motorType')[0];
              if (motorTypeElement) params.append('motorType', motorTypeElement.textContent);

              const laundryLoadWeightElement = product.getElementsByTagName('laundryLoadWeight')[0];
              if (laundryLoadWeightElement) params.append('laundryLoadWeight', laundryLoadWeightElement.textContent);

              const powerElement = product.getElementsByTagName('power')[0];
              if (powerElement) params.append('power', powerElement.textContent);

              const grillElement = product.getElementsByTagName('grill')[0];
              if (grillElement) params.append('grill', grillElement.textContent);

              const TypeOfCoffeeUsedElement = product.getElementsByTagName('TypeOfCoffeeUsed')[0];
              if (TypeOfCoffeeUsedElement) params.append('TypeOfCoffeeUsed', TypeOfCoffeeUsedElement.textContent);

              const typeElement = product.getElementsByTagName('type')[0];
              if (typeElement) params.append('type', typeElement.textContent);

              const energyEfficiencyClassElement = product.getElementsByTagName('energyEfficiencyClass')[0];
              if (energyEfficiencyClassElement) params.append('energyEfficiencyClass', energyEfficiencyClassElement.textContent);

              const numberOfPlaceSettingsElement = product.getElementsByTagName('numberOfPlaceSettings')[0];
              if (numberOfPlaceSettingsElement) params.append('numberOfPlaceSettings', numberOfPlaceSettingsElement.textContent);

              const vacuumCleanerTypeElement = product.getElementsByTagName('vacuumCleanerType')[0];
              if (vacuumCleanerTypeElement) params.append('vacuumCleanerType', vacuumCleanerTypeElement.textContent);

              const cleaningTypeElement = product.getElementsByTagName('cleaningType')[0];
              if (cleaningTypeElement) params.append('cleaningType', cleaningTypeElement.textContent);

              const dustCollectorTypeElement = product.getElementsByTagName('dustCollectorType')[0];
              if (dustCollectorTypeElement) params.append('dustCollectorType', dustCollectorTypeElement.textContent);

              const dustCollectorCapacityElement = product.getElementsByTagName('dustCollectorCapacity')[0];
              if (dustCollectorCapacityElement) params.append('dustCollectorCapacity', dustCollectorCapacityElement.textContent);

              const fullSpecsElement = product.getElementsByTagName('fullSpecs')[0];
              if (fullSpecsElement) params.append('fullSpecs', fullSpecsElement.textContent);

              const availabilityElement = product.getElementsByTagName('availability')[0];
              if (availabilityElement) params.append('availability', availabilityElement.textContent);

              params.append('image', product.getElementsByTagName('image')[0].textContent);

              // Создаем ссылку и добавляем текст продукта
              const productAnchor = document.createElement('a');
              productAnchor.setAttribute('href', productLink + params.toString());
              productAnchor.textContent = productName;

              // Создаем элемент для отображения найденного продукта
              const productElement = document.createElement('div');
              productElement.classList.add('search__results');
              productElement.appendChild(productAnchor);

              // Добавляем элемент в область результатов поиска
              searchResultsDiv.appendChild(productElement);
          } else {
              console.error("Элемент с тегом 'name' не найден для продукта:", product);
          }
      }
  }
}





const searchInput = document.getElementById("searchInput");

// Добавляем обработчик события для нажатия клавиши Enter
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        search();
    }
});

// Добавляем обработчик события для нажатия клавиши Delete
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Delete") {
        clearSearch();
    }
});


searchInput.addEventListener("keydown", function(event) {
  if (event.key === "Backspace") {
      const searchText = searchInput.value.trim();
      if (event.ctrlKey) {
          clearSearch(); // Если нажат Ctrl + Backspace, очищаем поиск
      } else if (searchText.length === 1) {
          clearSearch(); // Если остался только один символ, очищаем поиск
      } else {
          search(); // Если осталось более одного символа, обновляем результаты поиска
      }

  }
});



// Функция для скрытия или показа слайдера
function hideSlider(hide) {
  const popularSlider = document.querySelector(".content__popular");
  if (hide) {
      popularSlider.classList.add("hidden");
  } else {
      popularSlider.classList.remove("hidden");
  }
}


    
function addToCart(name, price) {
  // Получаем данные о корзине из localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Проверяем, есть ли уже товар с таким именем в корзине
  const existingItemIndex = cart.findIndex(item => item.name === name);
      // Если товара с таким именем еще нет в корзине, добавляем его
      cart.push({ name, price, quantity: 1 });

  // Обновляем данные о корзине в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Обновляем счетчик корзины
  updateCartCounter();

  location.reload();
}


// Функция для обновления счетчика корзины
function updateCartCounter() {
  // Получаем данные о корзине из localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Обновляем счетчик корзины в шапке сайта
  document.querySelector('.header_basket').innerText = cart.length;
}

// Функция для обновления текста кнопки в корзине на обеих страницах
function updateButtonStatus() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log("Cart items:", cart);
  const buyButtons = document.querySelectorAll('.catalog__buy--button');
  buyButtons.forEach(button => {
      const itemName = button.dataset.itemName;
      console.log("Button Item Name:", itemName);
      const isInCart = cart.some(item => item.name === itemName);
      console.log("Is in Cart:", isInCart);
      if (isInCart) {
          button.innerText = 'Добавлено';
          button.classList.add('added--to--cart');
          button.disabled = true;
      } else {
          button.innerText = 'в корзину';
          button.classList.remove('added--to--cart');
          button.disabled = false;
      }
  });
}
document.addEventListener("click", function(event) {
  if (event.target && event.target.classList.contains('catalog__buy--button')) {
      const button = event.target;
      const name = button.dataset.itemName;
      const price = button.dataset.itemPrice;
      addToCart(name, price);
      updateButtonStatus();
  }
});

/*___________________MODAL__WINDOW___________________*/ 
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function showOrderProcessedModal() {
  var modal = document.getElementById("orderProcessedModal");
  modal.style.display = "block";
}

function closeOrderProcessedModal() {
  var modal = document.getElementById("orderProcessedModal");
  modal.style.display = "none";
}

function showAlert(message) {
  var alertModal = document.getElementById("alertModal");
  var alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  alertModal.style.display = "block";
}

function closeAlertModal() {
  var alertModal = document.getElementById("alertModal");
  alertModal.style.display = "none";
}

function validateForm() {
  var name = document.getElementById("name").value.trim();
  var surname = document.getElementById("surname").value.trim();
  var telephone = document.getElementById("telephone").value.trim();
  var address = document.getElementById("address").value.trim();

  return name !== "" && surname !== "" && telephone !== "" && address !== "";
}

function handleSubmit() {
  if (validateForm()) {
    closeModal();
    showOrderProcessedModal();
    clearCart();
  } else {
    showAlert("Пожалуйста, заполните все обязательные поля.");
  }
}

/*_____________ADAPTATION____________ */
document.addEventListener("DOMContentLoaded", function() {
  // Создание основного бургер-меню
  const burgerMenu = document.createElement('div');
  burgerMenu.classList.add('burger-menu');

  const burgerCheckbox = document.createElement('input');
  burgerCheckbox.type = 'checkbox';
  burgerCheckbox.id = 'burgerToggle';

  const burgerLabel = document.createElement('label');
  burgerLabel.htmlFor = 'burgerToggle';

  // Добавление полосок в основное бургер-меню
  for (let i = 0; i < 3; i++) {
    const line = document.createElement('span');
    line.classList.add('line');
    burgerLabel.appendChild(line);
  }

  const burgerList = document.createElement('ul');

  // Создание пунктов основного меню
  const menuItems = [
    { href: 'index.html', text: 'Главная' },
    { href: 'index-payment.html', text: 'Оплата' },
    { href: 'index-delivery.html', text: 'Доставка' },
    { href: 'index-about-us.html', text: 'О нас' },
    { href: 'index-basket.html', text: 'Корзина' },
  ];

  menuItems.forEach(item => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.text;
    if (item.id) link.id = item.id;
    listItem.appendChild(link);
    burgerList.appendChild(listItem);
  });

  burgerMenu.appendChild(burgerCheckbox);
  burgerMenu.appendChild(burgerLabel);
  burgerMenu.appendChild(burgerList);

  document.querySelector('.header_nav').appendChild(burgerMenu);

  // Создание бургер-меню для каталога
  const catalogMenu = document.createElement('ul');
  catalogMenu.classList.add('catalog-menu');

  const catalogItems = [
    { href: 'index-refrigerators.html', text: 'Холодильники' },
    { href: 'index-vacuums.html', text: 'Пылесосы' },
    { href: 'index-washing-machines.html', text: 'Стиральные машины' },
    { href: 'index-microwaves.html', text: 'Микроволновки' },
    { href: 'index-dishwashers.html', text: 'Посудомоечные машины' },
    { href: 'index-coffeemaker.html', text: 'Кофемашины' },
    { href: 'index-cooker-hoods.html', text: 'Вытяжки кухонные' },
    { href: 'index-baths.html', text: 'Ванны' }
  ];

  catalogItems.forEach(item => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.text;
    listItem.appendChild(link);
    catalogMenu.appendChild(listItem);
  });

  const catalogCheckbox = document.createElement('input');
  catalogCheckbox.type = 'checkbox';
  catalogCheckbox.id = 'catalogToggleCheckbox';
  catalogCheckbox.classList.add('catalog-menu-toggle');

  const catalogLabel = document.createElement('label');
  catalogLabel.htmlFor = 'catalogToggleCheckbox';
  catalogLabel.classList.add('catalog-menu-toggle-label');
  catalogLabel.textContent = 'Каталог';

  // Добавление полосок в бургер-меню "Каталог"
  for (let i = 0; i < 3; i++) {
    const line = document.createElement('span');
    line.classList.add('line');
    catalogLabel.appendChild(line);
  }

  const catalogListItem = document.createElement('li');
  catalogListItem.appendChild(catalogCheckbox);
  catalogListItem.appendChild(catalogLabel);
  catalogListItem.appendChild(catalogMenu);

  burgerList.appendChild(catalogListItem);

  // Обработчики событий для управления отображением меню
  burgerLabel.addEventListener('click', function(event) {
    event.preventDefault();
    burgerCheckbox.checked = !burgerCheckbox.checked;
    burgerList.style.display = burgerCheckbox.checked ? 'block' : 'none';
    if (!burgerCheckbox.checked) {
      catalogCheckbox.checked = false;
      catalogMenu.style.display = 'none';
    }
  });

  catalogLabel.addEventListener('click', function(event) {
    event.preventDefault();
    catalogCheckbox.checked = !catalogCheckbox.checked;
    catalogMenu.style.display = catalogCheckbox.checked ? 'block' : 'none';
  });
});


$(document).ready(function(){
  function initSlider() {
    if ($(window).width() < 480) {
      $('.content__popular__slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1
      });
    }
  }

  // Инициализация слайдера при загрузке страницы
  initSlider();
});