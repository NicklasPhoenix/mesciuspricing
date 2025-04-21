// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('MESCIUS Pricing Page Loaded');
  
    // --- Global Variables ---
    const cartItems = [];
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const cartCountBadge = document.getElementById('cart-count');
    const cartIcon = document.getElementById('cart-icon');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const addonModal = document.getElementById('addon-modal');
    const modalCloseBtn = addonModal.querySelector('.modal-close-btn');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const modalProductNameEl = document.getElementById('addon-product-name');
    const modalBasePriceEl = document.getElementById('addon-base-price');
    const modalTotalPriceEl = document.getElementById('addon-total-price');
    const featureAddonsContainer = document.getElementById('feature-addons');
    const supportAddonsContainer = document.getElementById('support-addons');
    const submissionModal = document.getElementById('submission-confirmation');
    const submissionItemsList = document.getElementById('confirmation-items');
    const submissionTotalPrice = document.getElementById('confirmation-total-price');
    const submissionCloseBtns = submissionModal.querySelectorAll('.modal-close-btn');
    const toggleFeaturesBtn = document.getElementById('toggle-features-btn');
    const comparisonTable = document.querySelector('.comparison-table');
  
    let currentModalConfig = {};
  
    // --- Add-on Database (Based on Research & Search Results) ---
    const productAddonsDb = {
      "SpreadJS Pro": {
        features: [
          { id: 'sjs-pivot', name: 'PivotTable Engine', description: 'Enable Excel-like pivot table analysis.', price: 499 },
          { id: 'sjs-gantt', name: 'GanttSheet', description: 'Add project scheduling Gantt charts.', price: 599 },
          { id: 'sjs-reportsheet', name: 'ReportSheet', description: 'Design data-bound reports within SpreadJS.', price: 599},
          { id: 'sjs-datacharts', name: 'DataCharts', description: 'Bind charts directly to Data Manager data.', price: 399},
          { id: 'sjs-designer', name: 'Designer Ribbon Component', description: 'Embed a full designer UI ribbon.', price: 399 }
        ]
      },
       "ActiveReports JS Pro": { features: [ { id: 'arjs-export', name: 'Advanced Export Pack', description: 'Adds PDF/A, tagged PDF exports.', price: 199 }, ] },
       "ActiveReports .NET Pro": { features: [ { id: 'arnet-dashboard', name: 'Dashboard Module', description: 'Components for embedding reports in dashboards.', price: 299 }, ] },
       "DataViewsJS": { features: [ {id: 'dvjs-adv-views', name: 'Advanced View Pack', description: 'Adds Tree Map and specialized chart views.', price: 199 } ] }, // Example for DataViews
       "Document Solutions .NET Bundle": { features: [ {id: 'docs-ocr', name: 'OCR Module (Beta)', description: 'Extract text from scanned PDFs/images.', price: 499 } ] }, // Example for Doc Solutions
      "DEFAULT": { features: [] } // Default for Wijmo, Spread.NET etc.
    };
  
    // --- Header Shadow ---
    const header = document.querySelector('.site-header');
    if (header) { window.addEventListener('scroll', () => { header.classList.toggle('scrolled', window.scrollY > 20); }); }
  
    // --- Smooth Scrolling ---
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        try {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const headerOffset = document.querySelector('.site-header')?.offsetHeight || 65;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          } else { console.warn(`Smooth scroll target not found: ${targetId}`); }
        } catch (error) { console.error(`Error finding smooth scroll target ${targetId}: ${error}`); }
      });
    });
  
    // --- General Quote Form Logic ---
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
      quoteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const nameInput = document.getElementById('rq_name');
        const emailInput = document.getElementById('rq_email');
        const detailsInput = document.getElementById('rq_details');
        let isValid = true;
        nameInput.style.borderColor = ''; emailInput.style.borderColor = ''; detailsInput.style.borderColor = '';
        if (!nameInput.value.trim()) { alert('Please enter your name.'); nameInput.focus(); nameInput.style.borderColor = 'red'; isValid = false; }
        else if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) { alert('Please enter a valid work email address.'); emailInput.focus(); emailInput.style.borderColor = 'red'; isValid = false; }
        else if (!detailsInput.value.trim()) { alert('Please provide some details about your request.'); detailsInput.focus(); detailsInput.style.borderColor = 'red'; isValid = false;}
        if (isValid) {
          const formData = new FormData(quoteForm);
          const data = { interests: [] };
          formData.forEach((value, key) => { if (key === 'interest') { data.interests.push(value); } else { data[key] = value.trim(); } });
          console.log('General Inquiry Submitted:', data);
          alert('Thank you for your inquiry! We will be in touch shortly.');
          quoteForm.reset();
        }
      });
    }
    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase()); }
  
    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('main section[id]');
    const navItemsList = document.querySelectorAll('.nav-links a.nav-link');
    const setActiveLink = (id) => { navItemsList.forEach(item => { item.classList.remove('active'); if (item.getAttribute('href') === `#${id}`) { item.classList.add('active'); } }); };
    const navObserverOptions = { root: null, rootMargin: '-100px 0px -50% 0px', threshold: 0 };
    const navObserver = new IntersectionObserver((entries) => { let bestVisibleSectionId = null; entries.forEach(entry => { if (entry.isIntersecting) { if (bestVisibleSectionId === null) { bestVisibleSectionId = entry.target.getAttribute('id'); } } }); if (bestVisibleSectionId) { setActiveLink(bestVisibleSectionId); } }, navObserverOptions);
    sections.forEach(section => { if(section.id) { navObserver.observe(section); } });
  
    // --- Fade-in Animation ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserverOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const fadeObserver = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, fadeObserverOptions);
    fadeElements.forEach(el => { fadeObserver.observe(el); });
  
    // --- Add-on Modal Logic ---
    const productCards = document.querySelectorAll('.product-card');
    function populateAddonsModal(productName) {
      const addons = productAddonsDb[productName] || productAddonsDb["DEFAULT"];
      let featureHtml = '<h4>Feature Add-ons</h4>';
      if (addons.features.length > 0) {
        addons.features.forEach(addon => {
          featureHtml += `
            <label class="addon-item">
               <input type="checkbox" class="addon-checkbox" name="feature-addon" value="${addon.price}" data-addon-id="${addon.id}" data-addon-name="${addon.name}">
               <div class="addon-item-content">
                   <div class="addon-item-text">
                       <span>${addon.name}</span>
                       <span class="addon-description">${addon.description}</span>
                   </div>
                   <span class="addon-price">+ $${addon.price}/dev/yr</span>
               </div>
            </label>`;
        });
      } else { featureHtml += `<p><small>No specific feature add-ons currently listed for this product.</small></p>`; } // Updated message
      featureAddonsContainer.innerHTML = featureHtml;
      const standardSupport = supportAddonsContainer.querySelector('input[name="support-level"][value="0"]');
      if (standardSupport) standardSupport.checked = true;
      attachAddonListeners();
    }
  
    function calculateModalTotalPrice() {
      let total = currentModalConfig.basePrice || 0;
      addonModal.querySelectorAll('.addon-checkbox:checked').forEach(checkbox => { total += parseFloat(checkbox.value); });
      const selectedSupport = addonModal.querySelector('input[name="support-level"]:checked');
      if (selectedSupport) { total += parseFloat(selectedSupport.value); }
      modalTotalPriceEl.textContent = `$${total.toLocaleString()}`;
      currentModalConfig.totalPrice = total;
    }
  
    function attachAddonListeners() {
       const addonInputs = addonModal.querySelectorAll('.addon-checkbox, input[name="support-level"]');
      addonInputs.forEach(input => {
        input.removeEventListener('change', calculateModalTotalPrice);
        input.addEventListener('change', calculateModalTotalPrice);
      });
    }
  
    function openAddonModal(productName, basePrice) {
      currentModalConfig = { productName, basePrice };
      modalProductNameEl.textContent = `Configure ${productName}`;
      modalBasePriceEl.textContent = `$${basePrice.toLocaleString()}`;
      populateAddonsModal(productName);
      calculateModalTotalPrice();
      addonModal.style.display = 'flex';
      setTimeout(() => addonModal.classList.add('visible'), 10);
     }
  
    function closeAddonModal() {
      addonModal.classList.remove('visible');
      setTimeout(() => { addonModal.style.display = 'none'; }, 300);
    }
  
    productCards.forEach(card => {
      card.addEventListener('click', () => {
        const productName = card.dataset.productName;
        const basePrice = parseFloat(card.dataset.basePrice);
        openAddonModal(productName, basePrice);
      });
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); } });
    });
  
    if(modalCloseBtn) { modalCloseBtn.addEventListener('click', closeAddonModal); }
    if(addonModal) { addonModal.addEventListener('click', (event) => { if (event.target === addonModal) { closeAddonModal(); } }); }
  
    // --- Shopping Cart Logic ---
    function updateCartCount() {
      const count = cartItems.length;
      cartCountBadge.textContent = count;
      cartCountBadge.style.display = count > 0 ? 'flex' : 'none';
      cartCheckoutBtn.classList.toggle('disabled', count === 0);
    }
  
    function calculateCartTotal() {
       const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      cartTotalPriceElement.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  
    function renderCart() {
       if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty-message">Your quote cart is empty.</p>';
      } else {
        cartItemsContainer.innerHTML = '';
        cartItems.forEach((item, index) => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('cart-item');
          let addonsHtml = '';
          if (item.type === 'configured') {
              addonsHtml += '<ul class="cart-item-addons">';
              item.featureAddons.forEach(fa => { addonsHtml += `<li>${fa.name} (+$${fa.price})</li>`; });
              if (item.supportAddon) { addonsHtml += `<li>${item.supportAddon.name} (+$${item.supportAddon.price})</li>`; }
              addonsHtml += '</ul>';
          }
          itemElement.innerHTML = `
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name} ${item.type === 'configured' ? '(Configured)' : ''}</div>
              ${addonsHtml}
            </div>
             <div class="cart-item-price">$${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <button class="cart-item-remove-btn" data-index="${index}" title="Remove item">&times;</button>
          `;
          itemElement.querySelector('.cart-item-remove-btn').addEventListener('click', (e) => {
            const itemIndex = parseInt(e.target.dataset.index, 10);
            removeItemFromCart(itemIndex);
          });
          cartItemsContainer.appendChild(itemElement);
        });
      }
      calculateCartTotal();
      updateCartCount();
    }
  
    function addItemToCart(item) {
         const existingItemIndex = item.type !== 'configured' ? cartItems.findIndex(ci => ci.id === item.id) : -1;
         if(existingItemIndex > -1) { alert(`${item.name} is already in your cart.`); return; }
         cartItems.push(item);
         console.log("Item added:", item); console.log("Cart:", cartItems);
         renderCart(); showCart();
    }
  
    function removeItemFromCart(index) { if (index >= 0 && index < cartItems.length) { cartItems.splice(index, 1); renderCart(); } }
    function showCart() { cartSidebar.classList.add('visible'); }
    function hideCart() { cartSidebar.classList.remove('visible'); }
  
    if (cartIcon) { cartIcon.addEventListener('click', showCart); }
    if (cartCloseBtn) { cartCloseBtn.addEventListener('click', hideCart); }
  
    document.querySelectorAll('.add-to-cart-btn:not(#modal-add-to-cart-btn)').forEach(button => {
         button.addEventListener('click', (e) => {
            const targetButton = e.target.closest('.add-to-cart-btn');
            const suiteItem = { id: targetButton.dataset.itemId, name: targetButton.dataset.itemName, basePrice: parseFloat(targetButton.dataset.itemPrice), totalPrice: parseFloat(targetButton.dataset.itemPrice), type: 'suite' };
            addItemToCart(suiteItem);
        });
    });
  
     if(modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
          const featureAddons = [];
          addonModal.querySelectorAll('.addon-checkbox:checked').forEach(cb => { featureAddons.push({ id: cb.dataset.addonId, name: cb.dataset.addonName, price: parseFloat(cb.value) }); });
          const selectedSupportRadio = addonModal.querySelector('input[name="support-level"]:checked');
          let supportAddon = null;
          if (selectedSupportRadio && selectedSupportRadio.value !== "0") { supportAddon = { name: selectedSupportRadio.dataset.name, price: parseFloat(selectedSupportRadio.value) }; }
          const configuredItem = { id: `${currentModalConfig.productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`, name: currentModalConfig.productName, basePrice: currentModalConfig.basePrice, totalPrice: currentModalConfig.totalPrice, featureAddons: featureAddons, supportAddon: supportAddon, type: 'configured' };
          addItemToCart(configuredItem);
          closeAddonModal();
        });
      }
  
    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener('click', (e) => {
        if (cartItems.length === 0) { e.preventDefault(); alert("Your cart is empty."); return; }
        const cartDataForSubmission = cartItems.map(item => ({ id: item.id, name: item.name, type: item.type, totalPrice: item.totalPrice, ...(item.type === 'configured' && { basePrice: item.basePrice, featureAddons: item.featureAddons.map(fa => fa.id), supportAddon: item.supportAddon ? item.supportAddon.name : 'Standard' }) }));
        console.log("Submitting Cart for Quote/Checkout (Demo - Data Sent):", JSON.stringify(cartDataForSubmission, null, 2));
        let confirmationHtml = ''; let confirmationTotal = 0;
        cartItems.forEach(item => {
            confirmationTotal += item.totalPrice;
            let addonsListHtml = '';
            if (item.type === 'configured' && (item.featureAddons?.length > 0 || item.supportAddon)) { addonsListHtml = '<ul class="confirmation-item-addons">'; item.featureAddons.forEach(fa => { addonsListHtml += `<li>${fa.name}</li>`; }); if (item.supportAddon) { addonsListHtml += `<li>${item.supportAddon.name}</li>`; } addonsListHtml += '</ul>'; }
            confirmationHtml += `<div class="confirmation-item"><div class="confirmation-item-details"><div class="confirmation-item-name">${item.name} ${item.type === 'configured' ? '(Configured)' : ''}</div>${addonsListHtml}</div><div class="confirmation-item-price">$${item.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>`;
        });
        submissionItemsList.innerHTML = confirmationHtml;
        submissionTotalPrice.textContent = `$${confirmationTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        hideCart();
        submissionModal.style.display = 'flex';
        setTimeout(() => submissionModal.classList.add('visible'), 10);
        cartItems.length = 0; renderCart();
      });
    }
  
    const closeSubmissionModal = () => { submissionModal.classList.remove('visible'); setTimeout(() => { submissionModal.style.display = 'none'; }, 300); };
    submissionCloseBtns.forEach(btn => { btn.addEventListener('click', closeSubmissionModal); });
     if (submissionModal) { submissionModal.addEventListener('click', (event) => { if (event.target === submissionModal) { closeSubmissionModal(); } }); }
  
     // Feature Comparison Table Toggle
     if (toggleFeaturesBtn && comparisonTable) {
         // Function to set data-label attributes for mobile view
         const setTableDataLabels = () => {
             const headers = Array.from(comparisonTable.querySelectorAll('thead th')).map(th => th.textContent);
             comparisonTable.querySelectorAll('tbody tr').forEach(row => {
                 row.querySelectorAll('td').forEach((cell, index) => {
                     cell.setAttribute('data-label', headers[index]);
                 });
             });
         };
  
         toggleFeaturesBtn.addEventListener('click', () => {
             const isShowingAll = comparisonTable.classList.toggle('show-all');
             toggleFeaturesBtn.textContent = isShowingAll ? 'Show Fewer Features' : 'Show Full Comparison';
         });
  
         setTableDataLabels(); // Set labels on initial load
     }
  
    renderCart(); // Initial cart render
  
  }); // End DOMContentLoaded