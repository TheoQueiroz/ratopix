document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const decreaseBetBtn = document.getElementById('decrease-bet');
    const increaseBetBtn = document.getElementById('increase-bet');
    const startGameBtn = document.getElementById('start-game');
    const higherBtn = document.getElementById('higher-button');
    const lowerBtn = document.getElementById('lower-button');
    const currentNumberElement = document.getElementById('current-number');
    const nextNumberElement = document.getElementById('next-number');
    const historyList = document.getElementById('history-list');
    const jumpscare = document.getElementById('jumpscare');
    const jumpscareMessage = document.getElementById('jumpscare-message');
    const closeJumpscareBtn = document.getElementById('close-jumpscare');

    // Sons do jogo
    const sounds = {
        click: new Audio('https://www.myinstants.com/media/sounds/button-click-sound.mp3'),
        start: new Audio('https://www.myinstants.com/media/sounds/casino-bling.mp3'),
        win: new Audio('https://www.myinstants.com/media/sounds/cash-register-sound-effect.mp3'),
        lose: new Audio('https://www.myinstants.com/media/sounds/error-sound.mp3'),
        deal: new Audio('https://www.myinstants.com/media/sounds/card-flip-sound-effect.mp3')
    };

    // Configurar volume dos sons
    Object.values(sounds).forEach(sound => {
        sound.volume = 0.4;
    });

    // Função para tocar sons
    function playSound(soundName) {
        if (sounds[soundName]) {
            // Clona o som para permitir sobrepor
            const soundClone = sounds[soundName].cloneNode();
            soundClone.volume = sounds[soundName].volume;
            soundClone.play().catch(err => console.log('Erro ao tocar som:', err));
        }
    }

    // Variáveis do jogo
    let balance = 1000;
    let betAmount = 50;
    let playCount = 0;
    let gameActive = false;
    let currentNumber = 0;

    // Inicializar o jogo
    updateBalance();
    updateBetAmount();

    // Event Listeners
    decreaseBetBtn.addEventListener('click', () => {
        if (gameActive) return;
        
        if (betAmount > 10) {
            betAmount -= 10;
            updateBetAmount();
            playSound('click');
        }
    });

    increaseBetBtn.addEventListener('click', () => {
        if (gameActive) return;
        
        if (betAmount < Math.min(1000, balance)) {
            betAmount += 10;
            updateBetAmount();
            playSound('click');
        }
    });

    betAmountInput.addEventListener('change', () => {
        if (gameActive) return;
        
        let newBet = parseInt(betAmountInput.value);
        if (isNaN(newBet)) newBet = 10;
        if (newBet < 10) newBet = 10;
        if (newBet > balance) newBet = balance;
        betAmount = newBet;
        updateBetAmount();
        playSound('click');
    });

    startGameBtn.addEventListener('click', () => {
        if (gameActive) return;
        
        if (balance < betAmount) {
            alert('Saldo insuficiente para apostar!');
            playSound('lose');
            return;
        }
        
        // Deduzir o valor da aposta
        balance -= betAmount;
        updateBalance();
        
        // Iniciar o jogo
        playSound('start');
        startNewRound();
    });

    higherBtn.addEventListener('click', () => {
        if (!gameActive) return;
        playSound('click');
        makeGuess('higher');
    });

    lowerBtn.addEventListener('click', () => {
        if (!gameActive) return;
        playSound('click');
        makeGuess('lower');
    });

    closeJumpscareBtn.addEventListener('click', () => {
        jumpscare.classList.remove('active');
        playSound('click');
    });

    // Funções do jogo
    function updateBalance() {
        balanceElement.textContent = `R$ ${balance.toFixed(2)}`;
    }

    function updateBetAmount() {
        betAmountInput.value = betAmount;
    }

    function startNewRound() {
        gameActive = true;
        playCount++;
        
        // Habilitar/desabilitar botões
        startGameBtn.disabled = true;
        higherBtn.disabled = false;
        lowerBtn.disabled = false;
        
        // Gerar um número aleatório entre 1 e 10
        currentNumber = Math.floor(Math.random() * 10) + 1;
        
        // Efeito de "revelar" o número
        currentNumberElement.textContent = "?";
        playSound('deal');
        
        setTimeout(() => {
            currentNumberElement.textContent = currentNumber;
            
            // Verificar se este é o 8º jogo para preparar o jumpscare
            if (playCount === 8) {
                // Atrasar um pouco para o usuário ver o número atual
                setTimeout(triggerJumpscare, 1500);
            }
        }, 600);
        
        nextNumberElement.textContent = '?';
    }

    function makeGuess(guess) {
        if (!gameActive) return;
        
        // Gerar o próximo número
        const nextNumber = Math.floor(Math.random() * 10) + 1;
        
        // Efeito de "revelar" o número
        playSound('deal');
        
        setTimeout(() => {
            nextNumberElement.textContent = nextNumber;
            
            // Na 8ª jogada, o jogador sempre perde - não executar esta lógica
            if (playCount === 8) return;
            
            // Determinar se o jogador ganhou ou perdeu
            let isWin = false;
            
            if (guess === 'higher' && nextNumber > currentNumber) {
                isWin = true;
            } else if (guess === 'lower' && nextNumber < currentNumber) {
                isWin = true;
            } else if (nextNumber === currentNumber) {
                // Empate é uma perda
                isWin = false;
            }
            
            // Adicionar classe para destacar vitória/derrota
            const cardElement = document.querySelector('.next-card');
            cardElement.classList.add(isWin ? 'win' : 'lose');
            
            // Tocar som de vitória ou derrota
            playSound(isWin ? 'win' : 'lose');
            
            // Atualizar o saldo se ganhou
            if (isWin) {
                const winAmount = betAmount * 2;
                balance += winAmount;
                updateBalance();
                addToHistory(true, betAmount, winAmount);
            } else {
                addToHistory(false, betAmount, 0);
            }
            
            // Desabilitar botões de ação
            higherBtn.disabled = true;
            lowerBtn.disabled = true;
            
            // Esperar um tempo e então resetar para a próxima rodada
            setTimeout(() => {
                cardElement.classList.remove('win', 'lose');
                gameActive = false;
                startGameBtn.disabled = false;
            }, 1500);
        }, 600);
    }

    function addToHistory(isWin, bet, winAmount) {
        const historyItem = document.createElement('li');
        historyItem.className = isWin ? 'win' : 'loss';
        
        const resultText = isWin 
            ? `Ganhou R$ ${winAmount.toFixed(2)}` 
            : 'Perdeu';
        
        historyItem.innerHTML = `
            <span>Aposta: R$ ${bet.toFixed(2)}</span>
            <span>${resultText}</span>
        `;
        
        historyList.prepend(historyItem);
        
        // Limitar a lista a 10 itens
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    function triggerJumpscare() {
        // Zerar o saldo
        balance = 0;
        updateBalance();
        
        // Som de jumpscare
        playJumpscareSound();
        
        // Mostrar a imagem de jumpscare
        jumpscare.classList.add('active');
        
        // Reiniciar jogo
        gameActive = false;
        startGameBtn.disabled = false;
        higherBtn.disabled = true;
        lowerBtn.disabled = true;
        
        // Mensagem personalizada
        jumpscareMessage.textContent = "Você foi mordido pelo Ratão do pix e perdeu tudo!";
    }

    function playJumpscareSound() {
        try {
            // Criar um som de jumpscare usando APENAS os arquivos locais
            const sounds = [
                new Audio('1.wav'),  // Arquivo 1.wav
                new Audio('2.wav'),  // Arquivo 2.wav
                new Audio('3.wav'),  // Arquivo 3.wav
            ];
            
            // Configurar todos os sons para volume máximo
            sounds.forEach(sound => {
                sound.volume = 1.0;
                
                // Tentar forçar a reprodução automática
                sound.autoplay = true;
                sound.loop = false;
                
                // Adicionar ao body para aumentar as chances de reprodução
                document.body.appendChild(sound);
                
                // Tentar reproduzir
                const playPromise = sound.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('Erro ao reproduzir som:', e);
                    });
                }
            });
            
            // Tenta reproduzir um som através de AudioContext (método alternativo)
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                // Configurar um som alto e desagradável
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
                
                gainNode.gain.setValueAtTime(1, audioContext.currentTime);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                
                // Parar o som após 1 segundo
                setTimeout(() => {
                    oscillator.stop();
                }, 1000);
            } catch (e) {
                console.log('Erro ao usar AudioContext:', e);
            }
        } catch (error) {
            console.error('Erro geral ao reproduzir sons:', error);
        }
    }
}); 