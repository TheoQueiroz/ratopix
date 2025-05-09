// Este script cria uma imagem jumpscare utilizando canvas
// Você pode executá-lo em um navegador ou em Node.js com canvas

// Em um navegador:
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Fundo preto
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cores assustadoras
    const colors = ['red', 'darkred', '#ff0000', '#990000'];
    
    // Desenha formas estranhas
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        
        // Forma estranha
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 50 + Math.random() * 100;
        
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y - size / 2);
        ctx.lineTo(x + size * 1.5, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.closePath();
        ctx.fill();
    }
    
    // Desenha um rosto assustador
    ctx.fillStyle = 'white';
    
    // Olhos
    ctx.beginPath();
    ctx.arc(canvas.width / 3, canvas.height / 3, 50, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width * 2/3, canvas.height / 3, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupilas
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(canvas.width / 3, canvas.height / 3, 30, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width * 2/3, canvas.height / 3, 30, 0, Math.PI * 2);
    ctx.fill();
    
    // Boca assustadora
    ctx.fillStyle = 'darkred';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height * 2/3, 100, 0, Math.PI);
    ctx.fill();
    
    // Dentes
    ctx.fillStyle = 'white';
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const x = (canvas.width / 2) - 80 + i * 20;
        ctx.moveTo(x, canvas.height * 2/3);
        ctx.lineTo(x + 10, canvas.height * 2/3);
        ctx.lineTo(x + 5, canvas.height * 2/3 + 20);
        ctx.closePath();
        ctx.fill();
    }
    
    // Linhas de sangue
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.random() * 100 - 50, canvas.height);
        ctx.stroke();
    }
    
    // Converter para URL de dados
    const dataURL = canvas.toDataURL('image/jpeg');
    
    // Criar link para download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'jumpscare.jpg';
    link.textContent = 'Download Jumpscare Image';
    link.style.display = 'block';
    link.style.margin = '20px';
    
    document.body.appendChild(canvas);
    document.body.appendChild(link);
    
    console.log('Imagem criada! Clique no link para baixar.');
});

/* 
Para usar este script e gerar a imagem:
1. Crie um arquivo HTML simples
2. Inclua este script
3. Abra no navegador
4. A imagem será exibida e você poderá baixá-la
5. Renomeie para jumpscare.jpg e salve na raiz do projeto
*/ 