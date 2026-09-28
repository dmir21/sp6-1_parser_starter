// @todo: напишите здесь код парсера

function parsePage() {

    function parseMeta() {
        const fullTitle = document.title;
        const title = fullTitle.split(' — ')[0].trim();

        const descriptionMeta = document.querySelector('meta[name="description"]');
        const description = descriptionMeta.content.trim();

        const keywordsMeta = document.querySelector('meta[name="keywords"]');
        const keywords = keywordsMeta.content.split(",").map((word) => word.trim());

        const language = document.documentElement.lang.trim();

        const ogTags = document.querySelectorAll('meta[property^="og:"]');
        const opengraph = {};
        ogTags.forEach ((tag) => {
            const key = tag.getAttribute('property').slice(3);
            let value = tag.content.trim();
            if (key == 'title') {
                value = tag.content.split(' — ')[0].trim();
            }
            opengraph[key] = value;
        });

        return {
            title: title,
            description: description,
            keywords: keywords,
            language: language,
            opengraph: opengraph
        };
    }

    // function parseProduct() {
    //     const section = document.querySelector('section.product');

    //     const id = section.dataset.id.trim();
    //     console.log(id);

    //     return {
    //         id: id
    //         // name: "",
    //         // isLiked: "",
    //         // tags: {},
    //         // price: "",
    //         // oldPrice: "",
    //         // discount: "",
    //         // discountPercent: "",
    //         // currency: '',
    //         // properties: ,
    //         // description: ,
    //         // images: 
    //     };
    // }

    function parseProduct() {
        // Находим корневой элемент секции товара
        const section = document.querySelector('section.product');

        // --- id ---
        // data-id="product1" → dataset.id вернёт "product1"
        const id = section.dataset.id.trim();

        // --- name ---
        // <h1 class="title">About Vite</h1>
        const name = section.querySelector('h1.title').textContent.trim();
    
        // --- isLiked ---
        // <button class="like"></button>
        // Если у кнопки нет класса "active" → false
        const isLiked = section.querySelector('button.like').classList.contains('active');
    
        // --- tags ---
        // <span class="green">tag1</span>  → category
        // <span class="blue">tag2</span>   → label
        // <span class="red">tag3</span>    → discount
        const tagsMap = {
            green: 'category',
            blue: 'label',
            red: 'discount'
        };
        const tags = { category: [], discount: [], label: [] };
        const tagSpans = section.querySelectorAll('.tags span');
        tagSpans.forEach(function (span) {
            // У span может быть класс green, blue или red
            // Проверяем каждый возможный класс
            for (const cssClass in tagsMap) {
                if (span.classList.contains(cssClass)) {
                    // tagsMap["green"] → "category", значит кладём текст в tags.category
                    tags[tagsMap[cssClass]].push(span.textContent.trim());
                }
            }
        });

        // --- price и oldPrice ---
        // <div class="price">
        //     ₽50          ← текст узла (не в теге)
        //     <span>₽80</span>
        // </div>
        //
        // section.querySelector('.price') вернёт весь div
        // section.querySelector('.price span') вернёт только <span>₽80</span>
        // Чтобы взять ТОЛЬКО текст "₽50" (без текста внутри span),
        // используем .firstChild.textContent — это текстовый узел "₽50"
        const priceEl = section.querySelector('.price');
        const priceText = priceEl.firstChild.textContent.trim();   // "₽50"
        const oldPriceText = priceEl.querySelector('span').textContent.trim(); // "₽80"
        // Убираем символ валюты "₽" и парсим в число
        const price = parseFloat(priceText.replace('₽', ''));
        const oldPrice = parseFloat(oldPriceText.replace('₽', ''));
        // --- discount и discountPercent ---
        const discount = oldPrice - price; // 80 - 50 = 30
        const discountPercent = (discount / oldPrice * 100).toFixed(2) + '%';
        // (30 / 80 * 100) = 37.5 → toFixed(2) → "37.50" → + "%" → "37.50%"
        // --- currency ---
        const currency = 'RUB';

        // --- properties ---
        // <li>
        //     <span>key1</span>
        //     <span>value1</span>
        // </li>
        const properties = {};
        const propertyItems = section.querySelectorAll('.properties li');
        propertyItems.forEach(function (li) {
            const spans = li.querySelectorAll('span');
            const key = spans[0].textContent.trim();
            const value = spans[1].textContent.trim();
            properties[key] = value;
        });

        // --- description ---
        // Нужен innerHTML, а не textContent, потому что на выходе ожидается
        // строка с HTML-тегами: "<h3>Title</h3>\n<p>Answer...</p>\n..."
        const description = section.querySelector('.description').innerHTML.trim();
        
        // --- images ---
        // <img src="https://placehold.co/92x66?text=1"
        //      data-src="https://placehold.co/600?text=1"
        //      alt="slide1" />
        // src = preview, data-src = full, alt = alt
        const images = [];
        const imgElements = section.querySelectorAll('.preview nav img');
        imgElements.forEach(function (img) {
            images.push({
                preview: img.src.trim(),
                full: img.dataset.src.trim(),
                alt: img.alt.trim()
            });
        });

        // --- собираем результат ---
        return {
            id: id,
            name: name,
            isLiked: isLiked,
            tags: tags,
            price: price,
            oldPrice: oldPrice,
            discount: discount,
            discountPercent: discountPercent,
            currency: currency,
            properties: properties,
            description: description,
            images: images
        };
    }

    function parseSuggested() {

    }

    function parseReviews() {

    }

    // const metaInfo = parseMeta();
    parseProduct();

    return {
        meta: parseMeta(),
        product: parseProduct(),
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;