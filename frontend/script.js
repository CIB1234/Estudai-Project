// frontend/script.js
        const API_BASE_URL = 'http://localhost:5000/api'; 
        // Função para carregar dados do backend (ex: materiais)
        async function loadDataFromBackend() {
            try {
                const response = await fetch(`${API_BASE_URL}/items`); // Chama a rota de itens
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Dados recebidos do backend:', data);
                // Aqui você pode pegar esses dados e exibi-los no seu HTML
                // Por exemplo, se você tiver um <div> com id="materials-list"
                // materialsListDiv.innerHTML = data.map(item => `<div>${item.name}</div>`).join('');
            } catch (error) {
                console.error('Erro ao carregar dados do backend:', error);
            }
        }
        // Chame esta função quando a página carregar, ou quando for necessário
        document.addEventListener('DOMContentLoaded', () => {
            // ... (seu código existente para menu, dropdown, etc.) ...
            // Exemplo: Carregar dados quando a página inicial (index.html) carregar
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                loadDataFromBackend();
            }
        });


// Menu toggle functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
});

// Função para ativar abas (NOVA)
function activateTab(tabId) {
    // Esconde todos os conteúdos de tab
    document.querySelectorAll('.services-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove classe active de todos os botões de tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostra o conteúdo da tab selecionada
    const selectedTabContent = document.getElementById(`${tabId}-tab`);
    if (selectedTabContent) {
        selectedTabContent.classList.add('active');
    }
    
    // Ativa o botão da tab no cabeçalho
    const selectedTabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (selectedTabButton) {
        selectedTabButton.classList.add('active');
    }
    
    // Rolagem suave para a seção de serviços
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        window.scrollTo({
            top: servicesSection.offsetTop - 20, // Ajuste para a navbar fixa
            behavior: 'smooth'
        });
    }
    
    // Atualiza URL com hash e parâmetro 'tab'
    const url = new URL(window.location.href);
    url.hash = 'services';
    url.searchParams.set('tab', tabId);
    window.history.pushState({}, '', url); // Usa pushState para não recarregar a página
    
    // Salva no localStorage
    localStorage.setItem('activeTab', tabId);
}

// Smooth scroll para links do menu lateral (MODIFICADO)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        // Ignora links que são para as abas de serviço, pois eles são tratados pela activateTab
        if (href.startsWith('#services') && this.hasAttribute('data-tab')) {
            return; 
        }

        e.preventDefault();
        
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = 'auto';
        
        const targetId = href.substring(1); // Remove o '#'
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20, // Ajuste para a navbar fixa
                behavior: 'smooth'
            });
        }
    });
});

// Handle scrolling and tab activation after navigation (NOVO)
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get('tab');
    const currentHash = window.location.hash;

    if (currentHash === '#services') {
        const defaultTab = 'activities'; // Aba padrão se nenhuma for especificada
        const activeTab = urlTab || localStorage.getItem('activeTab') || defaultTab;
        
        if (['activities', 'materials'].includes(activeTab)) {
            activateTab(activeTab);
        } else {
            activateTab(defaultTab);
        }
    } else {
        // Se não estiver na seção de serviços, garante que a aba padrão esteja ativa
        // e remove o parâmetro 'tab' da URL se existir
        const url = new URL(window.location.href);
        if (url.searchParams.has('tab')) {
            url.searchParams.delete('tab');
            window.history.replaceState({}, '', url);
        }
        // Garante que a aba de atividades esteja ativa por padrão se a seção de serviços for a primeira a ser vista
        // ou se não houver hash na URL
        const servicesSection = document.getElementById('services');
        if (servicesSection && servicesSection.getBoundingClientRect().top < window.innerHeight && servicesSection.getBoundingClientRect().bottom > 0) {
             // Se a seção de serviços estiver visível na carga inicial, ative a aba padrão
             activateTab('activities');
        }
    }
});

// Profile dropdown toggle
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        profileDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.add('hidden');
        }
    });
}

// Services tab switching (mantido para os botões internos da seção)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        activateTab(tabId); // Usa a função unificada
    });
});
