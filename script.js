document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const foodData = {
        italian: {
            name: 'Italian',
            cover: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
            dishes: [
                { id: 101, name: 'Margherita Pizza', image:'Margherita Pizza.jpeg', description: 'Classic simplicity with fresh mozzarella and basil.' },
                { id: 102, name: 'Spaghetti Carbonara', image: 'Spaghetti Carbonara.jpg', description: 'Creamy pasta with eggs, cheese, and pancetta.' },
                { id: 103, name: 'Lasagna', image:'Lasagna.jpg', description: 'Layers of pasta, meat sauce, and cheese.' },
                { id: 104, name: 'Mushroom Risotto', image:'Mushroom Risotto.jpg', description: 'Creamy rice cooked in broth.' },
                { id: 105, name: 'Tiramisu', image: 'Tiramisu.jpg', description: 'Coffee-flavored dessert with mascarpone.' },
                { id: 106, name: 'Bruschetta', image: 'Bruschetta.jpg', description: 'Grilled bread with garlic and tomatoes.' },
                { id: 107, name: 'Ravioli', image: 'Ravioli.jpg', description: 'Stuffed pasta with ricotta and spinach.' },
                { id: 108, name: 'Pesto Pasta', image: 'Pesto Pasta.jpg', description: 'Pasta with fresh basil and pine nuts.' },
                { id: 109, name: 'Focaccia', image: 'Focaccia.jpg', description: 'Oven-baked flatbread with herbs.' },
                { id: 110, name: 'Gnocchi', image: 'Gnocchi.jpg', description: 'Soft potato dumplings.' },
            ]
        },
        mexican: {
            name: 'Mexican',
            cover: 'Mexican.jpeg',
            dishes: [
                { id: 201, name: 'Tacos al Pastor', image: 'Tacos al Pastor.jpeg', description: 'Spit-grilled pork with pineapple.' },
                { id: 202, name: 'Guacamole & Chips', image: 'Guacamole & Chips.jpeg', description: 'Avocado dip with lime and cilantro.' },
                { id: 203, name: 'Enchiladas', image: 'Enchiladas.jpeg', description: 'Corn tortillas with chili sauce and cheese.' },
                { id: 204, name: 'Quesadillas', image: 'Quesadillas.jpeg', description: 'Toasted tortilla with melted cheese.' },
                { id: 205, name: 'Churros', image: 'Churros.jpeg', description: 'Fried dough pastry with cinnamon sugar.' },
                { id: 206, name: 'Burrito Bowl', image:'Burrito Bowl.jpeg', description: 'Rice, beans, and your favorite toppings.' },
                { id: 207, name: 'Elote', image: 'Elote.jpeg', description: 'Grilled street corn with cotija cheese.' },
                { id: 208, name: 'Tamales', image: 'Tamales.jpg', description: 'Steamed masa with savory fillings.' },
                { id: 209, name: 'Ceviche', image: 'Ceviche.jpeg', description: 'Fresh seafood cured in citrus juices.' },
                { id: 210, name: 'Huevos Rancheros', image: 'Huevos Rancheros.jpg', description: 'Fried eggs on tortillas with salsa.' },
            ]
        },
        
        indian: {
            name: 'Indian',
            cover: 'Indian.jpeg',
            dishes: [
                { id: 301, name: 'Butter Chicken', image:'Butter Chicken.jpg' , description: 'Spit-grilled pork with pineapple.' },
                { id: 302, name: 'Paneer Tikka', image: 'Paneer Tikka.jpeg', description: 'Avocado dip with lime and cilantro.' },
                { id: 303, name: 'Chole Bhature', image:'Chole Bhature.jpeg' , description: 'Corn tortillas with chili sauce and cheese.' },
                { id: 304, name: 'Biryani', image:'Biryani.jpg', description: 'Fried dough pastry with cinnamon sugar.' },
                { id: 305, name: 'Dal Makhani', image: 'Dal Makhani.jpsg', description: 'Grilled street corn with cotija cheese.' },
                { id: 306, name: 'Naan', image: 'Naan.jpg', description: 'Steamed masa with savory fillings.' },
                { id: 307, name: 'Dhokla', image:'Dhokla.jpg', description: 'Fresh seafood cured in citrus juices.' },
                
            ]
        },
    };

    const state = {
        currentCuisineKey: null,
        cardIndex: 0,
        likedFoods: new Map(),
        completedCuisines: new Set(),
        userDetails: {
            name: 'Food Lover',
            joinDate: 'Just Joined!',
            bio: 'Loves discovering new flavors and cuisines from around the world!'
        },
        isDragging: false,
        startX: 0,
        currentX: 0,
    };

    // --- DOM ELEMENT REFERENCES ---
    const dom = {
        mainContent: document.querySelector('main'),
        bottomNav: document.querySelector('nav'),
        welcomeForm: document.getElementById('welcome-form'),
        nameInput: document.getElementById('name-input'),
        bioInput: document.getElementById('bio-input'),
        cuisineGrid: document.getElementById('cuisine-grid'),
        backToCuisineBtn: document.getElementById('back-to-cuisine'),
        cardContainer: document.getElementById('card-container'),
        noMoreCardsDiv: document.getElementById('no-more-cards'),
        changeCuisineBtn: document.getElementById('change-cuisine-btn'),
        likeBtn: document.getElementById('like-btn'),
        dislikeBtn: document.getElementById('dislike-btn'),
        actionButtons: document.getElementById('action-buttons'),
        pages: document.querySelectorAll('.page'),
        navItems: document.querySelectorAll('.nav-item'),
        matchesGrid: document.getElementById('matches-grid'),
        noMatchesDiv: document.getElementById('no-matches'),
        profileName: document.getElementById('profile-name'),
        profileJoinDate: document.getElementById('profile-join-date'),
        profileAvatar: document.getElementById('profile-avatar'),
        profileBioHeading: document.getElementById('profile-bio-heading'),
        profileBioText: document.getElementById('profile-bio-text'),
    };

    // --- CORE FUNCTIONS ---
    function showPage(pageId) {
        dom.pages.forEach(page => page.classList.remove('active'));
        const newPage = document.getElementById(`page-${pageId}`);
        if (newPage) newPage.classList.add('active');
        if (pageId === 'cuisine') updateCuisineGridVisuals();
        if (pageId === 'matches') updateMatchesPage();
    }

    function populateCuisineSelection() {
        dom.cuisineGrid.innerHTML = '';
        for (const key in foodData) {
            const cuisine = foodData[key];
            const card = document.createElement('div');
            card.className = 'cuisine-card rounded-xl h-40 flex items-center justify-center';
            card.style.backgroundImage = `url(${cuisine.cover})`;
            card.dataset.cuisine = key;
            card.innerHTML = `<h2 class="text-white text-2xl font-bold z-10 relative">${cuisine.name}</h2>`;
            dom.cuisineGrid.appendChild(card);
        }
    }

    function startSwiping(cuisineKey) {
        state.currentCuisineKey = cuisineKey;
        state.cardIndex = 0;
        dom.noMoreCardsDiv.classList.add('hidden');
        dom.actionButtons.classList.remove('hidden');
        dom.backToCuisineBtn.classList.remove('hidden');
        renderSwipeCards();
        showPage('home');
        updateActiveNavItem('home');
    }

    function renderSwipeCards() {
        dom.cardContainer.innerHTML = '';
        const dishes = foodData[state.currentCuisineKey].dishes;
        dishes.forEach((food, index) => {
            const cardElement = createCardElement(food, index, dishes.length);
            dom.cardContainer.appendChild(cardElement);
        });
        if (dom.cardContainer.children.length > 0) {
            const topCard = dom.cardContainer.children[0];
            topCard.style.transform = 'scale(1)';
            loadCardImage(topCard);
        }
    }

    function createCardElement(food, index, totalCards) {
        const cardElement = document.createElement('div');
        cardElement.className = 'food-card bg-white rounded-2xl shadow-lg overflow-hidden transform touch-none';
        cardElement.style.zIndex = totalCards - index;
        cardElement.style.transform = `translateY(${index * 10}px) scale(${1 - (index * 0.05)})`;
        cardElement.innerHTML = `
            <div class="like-indicator">LIKE</div>
            <div class="dislike-indicator">NOPE</div>
            <img data-src="${food.image}" alt="${food.name}" class="w-full h-full object-cover"
                 src="https://placehold.co/600x800/e5e7eb/e5e7eb"
                 onerror="this.onerror=null;this.src='https://placehold.co/600x800/f87171/ffffff?text=Image+Error';">
            <div class="absolute bottom-0 left-0 right-0 p-6 card-content">
                <h2 class="text-2xl md:text-3xl font-bold text-white">${food.name}</h2>
                <p class="text-white text-sm md:text-base">${food.description}</p>
            </div>
        `;
        return cardElement;
    }

    function loadCardImage(card) {
        if (!card) return;
        const img = card.querySelector('img');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }

    function handleSwipe(action) {
        const dishes = foodData[state.currentCuisineKey].dishes;
        if (state.cardIndex >= dishes.length) return;
        const cardElement = dom.cardContainer.children[state.cardIndex];
        if (!cardElement) return;
        const flyOutDirection = (action === 'like') ? 1 : -1;
        cardElement.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        cardElement.style.transform = `translateX(${flyOutDirection * window.innerWidth}px) rotate(${flyOutDirection * 15}deg)`;
        cardElement.style.opacity = '0';
        if (action === 'like') {
            const likedFood = dishes[state.cardIndex];
            state.likedFoods.set(likedFood.id, likedFood);
        }
        state.cardIndex++;
        if (state.cardIndex < dishes.length) {
            const nextCard = dom.cardContainer.children[state.cardIndex];
            if (nextCard) {
                nextCard.style.transition = 'transform 0.3s ease-in-out';
                nextCard.style.transform = 'scale(1)';
                loadCardImage(nextCard);
            }
        } else {
            state.completedCuisines.add(state.currentCuisineKey);
            setTimeout(() => {
                dom.noMoreCardsDiv.classList.remove('hidden');
                dom.actionButtons.classList.add('hidden');
                dom.backToCuisineBtn.classList.add('hidden');
            }, 300);
        }
    }

    // --- UI UPDATES ---
    function updateActiveNavItem(pageId) {
        dom.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageId);
        });
    }

    function updateCuisineGridVisuals() {
        const cuisineCards = dom.cuisineGrid.querySelectorAll('.cuisine-card');
        cuisineCards.forEach(card => {
            const cuisineKey = card.dataset.cuisine;
            card.classList.toggle('completed', state.completedCuisines.has(cuisineKey));
        });
    }

    function updateMatchesPage() {
        dom.matchesGrid.innerHTML = '';
        if (state.likedFoods.size === 0) {
            dom.noMatchesDiv.classList.remove('hidden');
        } else {
            dom.noMatchesDiv.classList.add('hidden');
            state.likedFoods.forEach(food => {
                const matchCard = document.createElement('div');
                matchCard.className = 'bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300';
                matchCard.innerHTML = `
                    <img src="${food.image}" alt="${food.name}" class="w-full h-32 object-cover">
                    <div class="p-3">
                        <h3 class="font-semibold text-sm text-gray-800 truncate">${food.name}</h3>
                    </div>
                `;
                dom.matchesGrid.appendChild(matchCard);
            });
        }
    }

    function updateProfilePage() {
        const { name, joinDate, bio } = state.userDetails;
        dom.profileName.textContent = name;
        dom.profileJoinDate.textContent = joinDate;
        dom.profileBioHeading.textContent = `About ${name.split(' ')[0]}`;
        dom.profileBioText.textContent = bio;
        const initial = name.charAt(0).toUpperCase();
        dom.profileAvatar.src = `https://placehold.co/80x80/f97316/ffffff?text=${initial}`;
    }

    // --- DRAG EVENTS ---
    function onDragStart(e) {
        const card = e.target.closest('.food-card');
        if (card !== dom.cardContainer.children[state.cardIndex]) return;
        state.isDragging = true;
        state.startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        card.style.transition = 'none';
        card.style.cursor = 'grabbing';
    }

    function onDragMove(e) {
        if (!state.isDragging) return;
        const card = dom.cardContainer.children[state.cardIndex];
        if (!card) return;
        state.currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const deltaX = state.currentX - state.startX;
        const rotation = deltaX / 20;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        const likeIndicator = card.querySelector('.like-indicator');
        const dislikeIndicator = card.querySelector('.dislike-indicator');
        const opacity = Math.min(Math.abs(deltaX) / (card.offsetWidth / 2), 1);
        if (deltaX > 0) {
            likeIndicator.style.opacity = opacity;
            dislikeIndicator.style.opacity = 0;
        } else {
            dislikeIndicator.style.opacity = opacity;
            likeIndicator.style.opacity = 0;
        }
    }

    function onDragEnd() {
        if (!state.isDragging) return;
        state.isDragging = false;
        const card = dom.cardContainer.children[state.cardIndex];
        if (!card) return;
        const deltaX = state.currentX - state.startX;
        const decisionThreshold = card.offsetWidth * 0.4;
        if (Math.abs(deltaX) > decisionThreshold) {
            handleSwipe(deltaX > 0 ? 'like' : 'dislike');
        } else {
            card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'scale(1)';
            card.querySelector('.like-indicator').style.opacity = 0;
            card.querySelector('.dislike-indicator').style.opacity = 0;
        }
        card.style.cursor = 'grab';
    }

    // --- EVENT BINDING ---
    function bindEvents() {
        // Welcome button click
        const startBtn = document.getElementById('start-btn');
        startBtn.addEventListener('click', () => {
            const name = dom.nameInput.value.trim();
            const bio = dom.bioInput.value.trim();
            state.userDetails.name = name || 'Food Lover';
            state.userDetails.bio = bio || 'Loves discovering new flavors and cuisines from around the world!';
            const joinDate = new Date();
            state.userDetails.joinDate = `Joined ${joinDate.toLocaleString('default', { month: 'long' })} ${joinDate.getFullYear()}`;
            updateProfilePage();
            dom.bottomNav.classList.remove('hidden');
            dom.mainContent.classList.remove('h-full');
            showPage('cuisine');
        });

        // Bottom navigation
        dom.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const pageId = item.dataset.page;
                if (pageId === 'home' && !state.currentCuisineKey) {
                    showPage('cuisine');
                    updateActiveNavItem(null);
                } else {
                    showPage(pageId);
                    updateActiveNavItem(pageId);
                }
            });
        });

        // Cuisine selection
        dom.cuisineGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.cuisine-card');
            if (card && !card.classList.contains('completed')) {
                startSwiping(card.dataset.cuisine);
            }
        });

        // Action buttons
        dom.likeBtn.addEventListener('click', () => handleSwipe('like'));
        dom.dislikeBtn.addEventListener('click', () => handleSwipe('dislike'));
        dom.backToCuisineBtn.addEventListener('click', () => showPage('cuisine'));
        dom.changeCuisineBtn.addEventListener('click', () => showPage('cuisine'));

        // Drag listeners
        document.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchstart', onDragStart, { passive: true });
        document.addEventListener('touchmove', onDragMove, { passive: true });
        document.addEventListener('touchend', onDragEnd);
    }

    // --- INIT ---
    function init() {
        populateCuisineSelection();
        bindEvents();
        dom.bottomNav.classList.add('hidden');
        dom.mainContent.classList.add('h-full');
        showPage('welcome');
    }

    init();
});

