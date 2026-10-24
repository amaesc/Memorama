# Crónicas del Abismo: Memoria de los Mitos de Cthulhu

Juego de memoria y horror cósmico basado en los relatos de H.P. Lovecraft, con una atmósfera lúgubre, barra de cordura reactiva, distorsiones visuales psicológicas, paisajes sonoros oscuros procedurales y una pantalla de apertura cinematográfica presentada por Undefine_Projects.

### Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> Se han incorporado las respuestas del usuario para definir la jugabilidad y atmósfera:
> - **Identidad Inicial**: Secuencia de apertura y bienvenida con *"Presentado por Undefine_Projects"*, con transición estilizada a modo de tomo antiguo abriéndose.
> - **Mecánica de Cordura (Sanity)**: Barra de cordura interactiva al 100%. Cada fallo reduce la cordura e incrementa gradualmente la aberración visual (viñeta oscura, sutil pulso de tentáculos, aberración cromática ligera). Si llega a 0, se desata la "Locura Cósmica". Los aciertos restauran una pizca de cordura.
> - **Dificultad Configurable**: Fácil (12 cartas / 6 pares), Normal (16 cartas / 8 pares) y Demente (24 cartas / 12 pares).
> - **Paisaje Sonoro Atmosférico**: Generador de audio procedural con Web Audio API (drone tenebroso de baja frecuencia, susurros cósmicos con filtros biquad, crujido de pergamino al voltear y resonancia arcana al emparejar), con interruptor de silenciar accesible en todo momento.

---

## 1. Visión General y Concepto Central

- **El Juego**: El jugador asume el rol de un investigador en Arkham desentrañando fragmentos prohibidos del *Necronomicón*. Debe emparejar entidades primigenias, reliquias arcanas y sellos de protección antes de que el peso del conocimiento prohibido consuma su frágil mente.
- **Entidades de los Mitos**:
  1. *Cthulhu* - El Gran Primigenio durmiente de R'lyeh
  2. *Nyarlathotep* - El Caos Reptante y mensajero de los Dioses
  3. *Yog-Sothoth* - La Llave y la Puerta en todas las dimensiones
  4. *Shub-Niggurath* - La Cabra Negra de los Bosques
  5. *Azathoth* - El Dios Ciego e Idiota en el centro del cosmos
  6. *Necronomicón* - El grimorio encuadernado en piel humana
  7. *Dagon* - El patriarca de los Profundos abisales
  8. *El Signo de los Antiguos* - El talismán protector tallado en piedra
  9. *Sabueso de Tíndalos* - Acechador de los ángulos del tiempo
  10. *Mi-Go* - Los emisarios fúngicos de Yuggoth
  11. *Trapezoedro Resplandeciente* - Ventana a la negrura absoluta
  12. *Ídolo de R'lyeh* - Reliquia ciclópea rescatada del océano

- **Audiencia y Atmósfera**: Admiradores de la literatura lovecraftiana, juegos de misterio y rompecabezas tácticos que buscan una experiencia inmersiva, sobria y atmosférica sin colores chillones ni estéticas infantiles.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujo del Jugador
```
┌──────────────────────────────────────────────┐
│  Pantalla de Apertura (Cinematográfica)      │
│  "Presentado por Undefine_Projects"          │
│  [ Entrada al Grimorio de Mitos ]            │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│  Mesa de Juego / El Santuario de Arkham      │
│  - Barra de Cordura con estado visual        │
│  - Selector de Dificultad (12 / 16 / 24)     │
│  - Contador de Movimientos y Tiempo          │
│  - Control de Sonido (Mute / Activo)         │
│  - Cuadrícula de Cartas con dorso rúnico     │
└──────────────────────┬───────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│ Victoria Arcana │         │ Locura Absoluta │
│ Rito Completado │         │ Cordura en Cero │
│ [Jugar de Nuevo]│         │ [Intentar de N.]│
└─────────────────┘         └─────────────────┘
```

### Paleta de Colores y Estilo Sombrío
- **Fondo Neutral Abisal (60%)**: `#090d10` (negro abisal verdoso), con texturas sutiles de niebla y grano de pergamino antiguo.
- **Superficies y Cartas (30%)**: `#11181c` y `#182228`, con bordes finos verde bronce marchito (`#2e493e`) y acentos de latón desgastado (`#8a784e`).
- **Acento y Cordura (10%)**: Verde eldritch fosforescente tenue (`#22c55e` cuando la mente está cuerda) degradando a un púrpura/carmesí corrupto (`#ef4444` y `#a855f7`) conforme la cordura desciende.
- **Tipografía**:
  - Títulos y nombres de deidades: `Cinzel` / Serif gótica clásica con espaciado amplio y misterioso.
  - Textos de interfaz y lore: `Plus Jakarta Sans` y fuente monoespaciada para estadísticas numéricas tabulares.
- **Efectos de Locura Reactiva**:
  - Viñeta oscura dinámica en las esquinas de la pantalla.
  - Sutil desenfoque y aberración cromática en fallos consecutivos.
  - Latidos cardíacos y susurros que se intensifican si la cordura está por debajo del 30%.

---

## 3. Decisiones de Producto y Arquitectura

1. **Pantalla Inicial "Presentado por Undefine_Projects"**:
   - Se muestra al cargar con una tipografía refinada, sutil resplandor eldritch y botón de entrada "Iniciar Ritual / Abrir Grimorio" para permitir que el AudioContext del navegador se inicialice con la interacción obligatoria del usuario.
2. **Sistema de Cartas**:
   - Cada carta cuenta con una ilustración única y estilizada en SVG/gráficos vectoriales oscuros de alta definición de cada entidad, su nombre en latín/lovecraftiano y una cita breve de los relatos de Lovecraft al lograr un par.
   - Animación de volteo 3D con `perspective: 1000px` y `rotateY` suave (menor a 250ms).
3. **Música y Audio Web Procedural (Sin Dependencias Externas)**:
   - Uso de `AudioContext` nativo del navegador para generar el zumbido abisal, susurros sibilantes, sonido de paso de hoja/volteo y campana de templo sumergido. Funciona offline y sin riesgo de enlaces caídos.
4. **Persistencia Local**:
   - Se guardan en `localStorage` los récords (menor tiempo y menor cantidad de turnos) para cada una de las tres dificultades.

---

## 4. Diagrama del Sistema y Componentes

```
┌──────────────────────────────────────────────────────────────────┐
│                             App.tsx                              │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │  Estado Global: gameState ('SPLASH' | 'PLAYING' | 'OVER')    │ │
│ │  AudioEngine: control de volumen, susurros y FX              │ │
│ └──────────────────────────────┬───────────────────────────────┘ │
│                                │                                 │
│         ┌──────────────────────┼───────────────────────┐         │
│         ▼                      ▼                       ▼         │
│ ┌───────────────┐   ┌─────────────────────┐   ┌────────────────┐ │
│ │  IntroSplash  │   │   GameBoard & HUD   │   │  ResultModal   │ │
│ │  "Presentado  │   │  - SanityMeter      │   │  - Victoria    │ │
│ │   por         │   │  - DifficultySelect │   │  - Locura      │ │
│ │   Undefine_   │   │  - CardGrid         │   │  - Récords     │ │
│ │   Projects"   │   │  - LoreViewer       │   │  - Reinicio    │ │
│ └───────────────┘   └─────────────────────┘   └────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```
