 const menuButton = document.querySelector('.menu-button');
    const accountDialog = document.getElementById('accountDialog');
    const closeDialogButton = document.getElementById('closeDialog');
    const depositButton = document.getElementById('depositButton');
    const withdrawButton = document.getElementById('withdrawButton');
    const accountBalanceElement = document.getElementById('account-balance');
    const accountBalanceDialogElement = document.getElementById('account-balance-dialog');
    const coinContainer = document.querySelector('.coin-container');
    const coinElement = document.querySelector('.coin');
    const flipButton = document.querySelector('#flip-button');
    const resultText = document.querySelector('#result');
    const predictionText = document.querySelector('#prediction');
    const predictionForm = document.querySelector('#prediction-form');
    const winLoseText = document.querySelector('#win-lose');
    const depositConfirmation = document.getElementById('depositConfirmation');
    const depositAmountDisplay = document.getElementById('depositAmountDisplay');
    const closeDepositConfirmation = document.getElementById('closeDepositConfirmation');
    const ussdButton = document.getElementById('ussdButton');
    const ussdCodeElement = document.getElementById('ussdCode');
    const copyNotification = document.getElementById('copyNotification');
    const loader = document.querySelector('.loader');

    let predictedOutcome = null;
    let isAnimating = false;
    let accountBalance = 400;
    let currentDepositAmount = 0;
    const flipCost = 200;

    function updateBalance() {
      accountBalanceElement.textContent = accountBalance;
      accountBalanceDialogElement.textContent = accountBalance;
    }

    function approveDeposit() {
      loader.style.display = 'block';
      document.querySelector('.confirmation-content').style.display = 'none';

      setTimeout(() => {
        accountBalance += currentDepositAmount;
        updateBalance();

        loader.style.display = 'none';
        document.querySelector('.confirmation-content').style.display = 'block';
        document.querySelector('.confirmation-content h3').textContent = 'Deposit Approved!';
        document.querySelector('.confirmation-content p').innerHTML = `
          Successfully deposited UGX ${currentDepositAmount}.<br>
          Your new balance is UGX ${accountBalance}.
        `;

        ussdCodeElement.style.display = 'none';
        document.querySelector('.instructions').style.display = 'none';
        ussdButton.style.display = 'none';
        closeDepositConfirmation.textContent = 'OK';
      }, 2000);
    }

    // Copy USSD code to clipboard
    ussdCodeElement.addEventListener('click', () => {
      navigator.clipboard.writeText('*165*3*498576#').then(() => {
        copyNotification.classList.add('show');
        setTimeout(() => {
          copyNotification.classList.remove('show');
        }, 2000);
      });
    });

    menuButton.addEventListener('click', () => {
      accountDialog.showModal();
    });

    closeDialogButton.addEventListener('click', () => {
      accountDialog.close();
    });

    depositButton.addEventListener('click', () => {
      const depositAmount = parseInt(prompt("Enter deposit amount:"), 10);
      if (!isNaN(depositAmount) && depositAmount > 0) {
        currentDepositAmount = depositAmount;
        depositAmountDisplay.textContent = depositAmount;

        // Reset popup state
        document.querySelector('.confirmation-content h3').textContent = 'Approve Deposit via USSD';
        ussdCodeElement.style.display = 'block';
        document.querySelector('.instructions').style.display = 'block';
        ussdButton.style.display = 'inline-block';
        closeDepositConfirmation.textContent = 'Cancel';
        loader.style.display = 'none';
        document.querySelector('.confirmation-content').style.display = 'block';

        depositConfirmation.style.display = 'block';
      } else if (depositAmount !== null) {
        alert("Please enter a valid deposit amount.");
      }
    });

    ussdButton.addEventListener('click', () => {
      approveDeposit();
    });

    closeDepositConfirmation.addEventListener('click', () => {
      depositConfirmation.style.display = 'none';
      // Reset popup for next use
      ussdCodeElement.style.display = 'block';
      document.querySelector('.instructions').style.display = 'block';
      ussdButton.style.display = 'inline-block';
      document.querySelector('.confirmation-content h3').textContent = 'Approve Deposit via USSD';
    });

    withdrawButton.addEventListener('click', () => {
      const withdrawAmount = parseInt(prompt("Enter withdrawal amount:"), 10);
      if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
        if (withdrawAmount <= accountBalance) {
          accountBalance -= withdrawAmount;
          updateBalance();
          alert(`Successfully withdrew UGX ${withdrawAmount} To MTN UG`);
        } else {
          alert("Insufficient balance for withdrawal.");
        }
      } else if (withdrawAmount !== null) {
        alert("Please enter a valid withdrawal amount.");
      }
    });

    predictionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const selectedPrediction = document.querySelector('input[name="prediction"]:checked');
      if (selectedPrediction) {
        predictedOutcome = selectedPrediction.value;
        predictionText.textContent = `Choice is ${predictedOutcome}`;
      } else {
        alert('Please select Front or Back before confirming.');
      }
    });

    flipButton.addEventListener('click', () => {
      if (isAnimating) return;
      if (!predictedOutcome) {
        alert('Please CONFIRM choice before spinning.');
        return;
      }
      if (accountBalance < flipCost) {
        alert('Insufficient balance Please Deposit');
        return;
      }

      isAnimating = true;
      winLoseText.textContent = '';
      resultText.textContent = '';
      accountBalance -= flipCost;
      updateBalance();
      flipButton.disabled = true;
      coinElement.classList.add('spinning');

      const finalRotationY = Math.random() < 0.5 ? 0 : 180;
      let currentRotationY = 0;
      let speed = 360 * 4 + Math.random() * 360;

      const animateSpin = () => {
        if (speed <= 10) {
          clearInterval(spinAnimation);
          coinElement.classList.remove('spinning');
          coinElement.style.transform = `rotateY(${finalRotationY}deg)`;
          const outcome = finalRotationY === 0 ? 'Front' : 'Back';
          resultText.textContent = `Answer is ${outcome}`;

          if (outcome === predictedOutcome) {
            winLoseText.textContent = 'Won +200';
accountBalance += 400;
          } else {
            winLoseText.textContent = 'Lost -200';
          }
          updateBalance();
          predictedOutcome = null;
          predictionText.textContent = '';
          const radioButtons = document.querySelectorAll('input[name="prediction"]');
          radioButtons.forEach(radio => radio.checked = false);
          isAnimating = false;
          flipButton.disabled = false;
          return;
        }

        currentRotationY += speed / 60;
        coinElement.style.transform = `rotateY(${currentRotationY}deg)`;
        speed *= 0.98;
      };

      const spinAnimation = setInterval(animateSpin, 16);
    });

    coinContainer.addEventListener('click', () => {
      flipButton.click();
    });

