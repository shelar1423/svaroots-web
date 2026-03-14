(function () {
  var KEY_DESIGN = 'svarootsCheckoutDesign';
  var KEY_ADDRESS = 'svarootsCheckoutAddress';
  var KEY_PAYMENT = 'svarootsCheckoutPayment';

  function bySelector(selector) {
    return document.querySelector(selector);
  }

  function bySelectorAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (err) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // ignore storage failures for static preview environments
    }
  }

  function currentPageName() {
    var path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1);
  }

  function setBackLink(target) {
    var back = bySelector('.back-link');
    if (!back || !target) {
      return;
    }

    back.style.cursor = 'pointer';
    back.setAttribute('role', 'button');
    back.setAttribute('tabindex', '0');

    function goBack() {
      window.location.href = target;
    }

    back.addEventListener('click', goBack);
    back.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goBack();
      }
    });
  }

  function getFallbackDesign() {
    return {
      title: 'Phulkari Kit',
      size: '6',
      motif: 'floral',
      color: 'red'
    };
  }

  function mapDesignForDisplay(raw) {
    if (!raw) {
      return getFallbackDesign();
    }

    return {
      title: raw.design_name || 'Custom Svaroots Sneaker',
      size: raw.sneaker_size || '6',
      motif: raw.motif || 'floral',
      color: raw.sneaker_color || 'red'
    };
  }

  function hydrateCartSummary() {
    var design = mapDesignForDisplay(readJson(KEY_DESIGN, null));

    var titleNode = bySelector('.product-title');
    if (titleNode) {
      titleNode.textContent = design.title;
    }

    var descNodes = bySelectorAll('.product-desc');
    if (descNodes[0]) {
      descNodes[0].textContent = 'Size: ' + design.size;
    }
    if (descNodes[1]) {
      descNodes[1].textContent = 'Motif: ' + design.motif;
    }
    if (descNodes[2]) {
      descNodes[2].textContent = 'Colour: ' + design.color;
    }
  }

  function registerAddressPage() {
    var formNode = bySelector('#addressForm');
    var fullName = bySelector('#addressForm input[placeholder="Full Name"]');
    var building = bySelector('#addressForm input[placeholder="Building Name & No."]');
    var city = bySelector('#addressForm input[placeholder="City"]');
    var pincode = bySelector('#addressForm input[placeholder="Pincode"]');
    var country = bySelector('#addressForm input[placeholder="Country"]');

    var savedAddress = readJson(KEY_ADDRESS, {});
    if (fullName) fullName.value = savedAddress.fullName || '';
    if (building) building.value = savedAddress.building || '';
    if (city) city.value = savedAddress.city || '';
    if (pincode) pincode.value = savedAddress.pincode || '';
    if (country) country.value = savedAddress.country || '';

    window.toggleAddressForm = function () {
      if (!formNode) {
        return;
      }
      formNode.style.display = formNode.style.display === 'flex' ? 'none' : 'flex';
    };

    var saveBtn = bySelector('#addressForm .save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function (event) {
        event.preventDefault();
        var payload = {
          fullName: fullName ? fullName.value.trim() : '',
          building: building ? building.value.trim() : '',
          city: city ? city.value.trim() : '',
          pincode: pincode ? pincode.value.trim() : '',
          country: country ? country.value.trim() : ''
        };
        writeJson(KEY_ADDRESS, payload);
      });
    }

    var proceedBtn = bySelector('.payment-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', function (event) {
        event.preventDefault();

        var deliveryInput = bySelector('.delivery-options input[type="radio"]:checked');
        var deliveryLabel = '';
        if (deliveryInput) {
          var deliveryCard = deliveryInput.closest('.delivery-card');
          var heading = deliveryCard ? deliveryCard.querySelector('h3') : null;
          deliveryLabel = heading ? heading.textContent.trim() : '';
        }

        var currentAddress = readJson(KEY_ADDRESS, {});
        currentAddress.delivery = deliveryLabel || 'Standard Delivery';
        writeJson(KEY_ADDRESS, currentAddress);

        window.location.href = 'payment.html';
      });
    }
  }

  function onlyDigits(value) {
    return (value || '').replace(/\D+/g, '');
  }

  function normalizeCardInput(rawValue) {
    return onlyDigits(rawValue).substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
  }

  function registerPaymentPage() {
    var creditCardRadio = bySelector('#credit-card');
    if (creditCardRadio) {
      creditCardRadio.checked = true;
    }

    var cardInput = bySelector('.card-input');
    var expiryInput = bySelector('.two-fields input[placeholder="Expiry Date, MM/YY"]');
    var cvvInput = bySelector('.two-fields input[placeholder="CVV"]');
    var saveCardInput = bySelector('.save-card input[type="checkbox"]');

    var saved = readJson(KEY_PAYMENT, {
      cardNumber: '4111 1111 1111 1111',
      expiry: '12/30',
      cvv: '123',
      remember: true,
      method: 'credit-card'
    });

    if (cardInput) cardInput.value = saved.cardNumber || '4111 1111 1111 1111';
    if (expiryInput) expiryInput.value = saved.expiry || '12/30';
    if (cvvInput) cvvInput.value = saved.cvv || '123';
    if (saveCardInput) saveCardInput.checked = !!saved.remember;

    if (cardInput) {
      cardInput.addEventListener('input', function () {
        cardInput.value = normalizeCardInput(cardInput.value);
      });
    }

    if (cvvInput) {
      cvvInput.addEventListener('input', function () {
        cvvInput.value = onlyDigits(cvvInput.value).substring(0, 3);
      });
    }

    var saveBtn = bySelector('.payment-content .save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function (event) {
        event.preventDefault();

        var activePaymentOption = bySelector('input[name="payment"]:checked');

        var payload = {
          method: activePaymentOption ? activePaymentOption.id : 'credit-card',
          cardNumber: cardInput ? cardInput.value.trim() : '',
          expiry: expiryInput ? expiryInput.value.trim() : '',
          cvv: cvvInput ? cvvInput.value.trim() : '',
          remember: saveCardInput ? saveCardInput.checked : false
        };

        writeJson(KEY_PAYMENT, payload);
      });
    }

    var payBtn = bySelector('.pay-btn');
    if (payBtn) {
      payBtn.addEventListener('click', function (event) {
        event.preventDefault();

        var selectedMethod = bySelector('input[name="payment"]:checked');
        var method = selectedMethod ? selectedMethod.id : 'credit-card';

        if (method === 'credit-card') {
          var cardDigits = onlyDigits(cardInput ? cardInput.value : '');
          var cvvDigits = onlyDigits(cvvInput ? cvvInput.value : '');
          if (cardDigits.length < 12 || !(expiryInput && expiryInput.value.trim()) || cvvDigits.length !== 3) {
            alert('Please enter valid card details to continue.');
            return;
          }
        }

        var paymentPayload = {
          method: method,
          cardNumber: cardInput ? cardInput.value.trim() : '',
          expiry: expiryInput ? expiryInput.value.trim() : '',
          cvv: cvvInput ? cvvInput.value.trim() : '',
          remember: saveCardInput ? saveCardInput.checked : false
        };
        writeJson(KEY_PAYMENT, paymentPayload);
        window.location.href = 'post-payment.html';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var page = currentPageName();

    if (page === 'cart-summary.html') {
      hydrateCartSummary();
      setBackLink('plp.html');
    }

    if (page === 'address.html') {
      registerAddressPage();
      setBackLink('cart-summary.html');
    }

    if (page === 'payment.html') {
      registerPaymentPage();
      setBackLink('address.html');
    }
  });
})();
