# Simulador de Compra de Cartera Hipotecaria - Agile Home

Un simulador web que permite a los usuarios comparar diferentes opciones de compra de cartera hipotecaria entre múltiples bancos colombianos, calculando ahorros potenciales y facilitando la toma de decisiones financieras.

## Características

- **Comparación Múltiple**: Compara ofertas de 5 bancos principales de Colombia
- **Cálculos Precisos**: Simulación de pagos mensuales y ahorros totales
- **Interfaz Intuitiva**: Diseño responsivo con los colores de Agile Home
- **Contacto Directo**: Integración con WhatsApp para contactar asesores
- **Validación Completa**: Validación de formularios y lógica de negocio

## Bancos Incluidos

- **Banco de Bogotá**: 10.95% - 12.68% + 9.95% (campaña nómina hasta 30 julio)
- **BBVA**: 12.95% - 15.79% (VIS), desde 14.92% (No VIS)
- **Itau**: 11.71% - 12.40%
- **Banco de Occidente**: 10.85% - 16.16%
- **Caja Social**: 10.00% - 16.60%

## Tecnologías

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Estilos**: Bootstrap 5, CSS personalizado
- **Fuentes**: Google Fonts (Poppins)
- **Iconos**: Bootstrap Icons

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/simulador-cartera-hipotecaria.git
cd simulador-cartera-hipotecaria
Instala las dependencias:
pip install -r requirements.txt
Configura las variables de entorno (opcional):
export SESSION_SECRET="tu-clave-secreta"
export WHATSAPP_NUMBER="57300XXXXXXX"
Ejecuta la aplicación:
python main.py
La aplicación estará disponible en http://localhost:5000
simulador-cartera-hipotecaria/
├── static/
│   ├── css/
│   │   └── style.css          # Estilos personalizados
│   └── js/
│       └── calculator.js      # Lógica del calculador
├── templates/
│   └── index.html             # Plantilla principal
├── app.py                     # Aplicación Flask principal
├── main.py                    # Punto de entrada
├── requirements.txt           # Dependencias Python
├── Procfile                   # Configuración para Heroku
├── LICENSE                    # Licencia MIT
├── deploy.md                  # Guía de despliegue
└── README.md                  # Este archivo
Uso
Ingresa los datos de tu hipoteca actual:

Valor del inmueble
Saldo de la cartera a comprar
Plazo inicial y restante (en meses)
Tasa efectiva anual actual
Valor de seguros
Plazo deseado para la nueva cartera (en meses)
Selecciona los bancos a comparar:

Puedes seleccionar todos o solo algunos bancos
Cada banco muestra sus rangos de tasas
Banco de Bogotá incluye campaña especial
Obtén los resultados:

Comparación de cuotas mensuales
Cálculo de ahorros mensuales y totales
Opción de contactar directamente cada banco
Campaña especial destacada para Banco de Bogotá
Configuración
Variables de Entorno
SESSION_SECRET: Clave secreta para sesiones de Flask
WHATSAPP_NUMBER: Número de WhatsApp para contacto (formato: 57300XXXXXXX)
Personalización
Colores: Modifica las variables CSS en static/css/style.css
Bancos: Actualiza el diccionario BANKS en app.py
Textos: Edita los textos en templates/index.html
Despliegue
Heroku (Recomendado)
Crea una app en Heroku
Conecta tu repositorio GitHub
Configura las variables de entorno
Despliega automáticamente
Ver guía completa en deploy.md

Otras Plataformas
Railway: Detección automática de Flask
Render: Compatible con Procfile
Google Cloud: App Engine compatible
Características Técnicas
Cálculos Financieros
Fórmula de amortización estándar
Cálculo de pagos mensuales precisos
Comparación de ahorros reales
Manejo de seguros por separado
Validaciones
Validación de formularios en tiempo real
Verificación de lógica de negocio
Límites máximos de plazos (360 meses)
Validación de relación valor inmueble/saldo
Diseño Responsivo
Optimizado para móvil y desktop
Grid CSS adaptativo
Componentes Bootstrap 5
Animaciones suaves
Información Legal
Los resultados son referenciales
Las tasas están sujetas a cambios
Las tarifas de seguros pueden variar
Consulta con asesores Agile Home para información exacta
Contribución
Fork el proyecto
Crea una rama para tu función (git checkout -b feature/nueva-funcion)
Commit tus cambios (git commit -am 'Agrega nueva función')
Push a la rama (git push origin feature/nueva-funcion)
Crea un Pull Request
Roadmap
 Integración con APIs bancarias en tiempo real
 Sistema de usuarios y historial
 Comparación con gráficos interactivos
 Calculadora de capacidad de pago
 Notificaciones de cambios de tasas
Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

Soporte
Para soporte técnico o consultas sobre el simulador:

📞 Contacta a tu asesor Agile Home
💬 WhatsApp integrado en la aplicación
📧 Información de contacto en la aplicación
Changelog
v1.0.0 - Lanzamiento inicial
Simulador completo de compra de cartera
5 bancos colombianos incluidos
Diseño responsivo con branding Agile Home
Integración WhatsApp
Campaña especial Banco de Bogotá
Agile Home - Tu aliado en el camino hacia la casa de tus sueños

Este README incluye:
✓ Información actualizada sobre los bancos y tasas
✓ Estructura del proyecto completa
✓ Instrucciones de instalación y despliegue
✓ Características técnicas detalladas
✓ Información legal importante
✓ Roadmap para futuras mejoras
✓ Toda la información necesaria para desarrolladores
