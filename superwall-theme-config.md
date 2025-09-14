# Superwall Paywall Theme Configuration

## 🎨 Návod pro nastavení designu v Superwall Dashboard

### 1. Přihlášení do Superwall Dashboard
1. Jdi na https://dashboard.superwall.com
2. Přihlas se pomocí API klíče

### 2. Vytvoření nové paywall nebo úprava existující
1. Klikni na **Paywalls** → **New Paywall** (nebo edituj existující)
2. V editoru klikni na záložku **Theme**

### 3. Nastavení Custom Variables (Theme Variables)

Vytvoř následující custom variables v sekci **Theme Variables**:

#### 🎨 Core Colors (Základní barvy)
```css
/* Hlavní barvy */
--primary-action: #38BDF8
--secondary-bg: #1E3A8A  
--main-text: #FFFFFF
--cta-text: #0F172A
--accent-green: #34D399
--dark-bg: #0B1120

/* Progress bar */
--progress-fill: #38BDF8
--progress-track: rgba(255, 255, 255, 0.2)

/* Text barvy */
--question-label: #7DD3FC
--description-text: #BAE6FD
```

#### 🌈 Gradient Colors
```css
/* Gradient pozadí */
--gradient-start: #6366F1
--gradient-middle: #3B82F6
--gradient-end: #1E293B

/* Blur ball efekty */
--blur-ball-1: rgba(56, 189, 248, 0.4)
--blur-ball-2: rgba(30, 58, 138, 0.4)
--blur-ball-3: rgba(56, 189, 248, 0.2)
--blur-ball-4: rgba(52, 211, 153, 0.2)
```

#### 📏 Spacing & Sizes
```css
/* Spacing */
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px

/* Border radius */
--radius-button: 50px
--radius-card: 16px
--radius-small: 8px
```

#### 🔤 Typography
```css
/* Font sizes */
--font-size-title: 32px
--font-size-subtitle: 20px
--font-size-body: 16px
--font-size-small: 14px

/* Font weights */
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### 4. Aplikace stylu na komponenty

#### Background (Pozadí)
1. Vyber hlavní Stack kontejner
2. Nastav **Background** na gradient:
   - Type: **Linear Gradient**
   - Start Color: `var(--gradient-start)`
   - Middle Color: `var(--gradient-middle)`
   - End Color: `var(--gradient-end)`
   - Direction: **135deg** (diagonal)

#### Main Title (Hlavní nadpis)
1. Vyber Text komponent pro nadpis
2. Nastav:
   - Font Size: `var(--font-size-title)`
   - Font Weight: `var(--font-weight-bold)`
   - Color: `var(--main-text)`
   - Text Shadow: `0px 3px 6px rgba(0, 0, 0, 0.4)`

#### CTA Button (Hlavní tlačítko)
1. Vyber Button komponent
2. Nastav:
   - Background: `var(--main-text)` (bílé)
   - Text Color: `var(--cta-text)` (tmavý text)
   - Border Radius: `var(--radius-button)`
   - Padding: `var(--spacing-md) var(--spacing-xl)`
   - Box Shadow: `0px 8px 24px rgba(255, 255, 255, 0.2)`

#### Secondary Button (Sekundární tlačítko)
1. Vyber Button komponent
2. Nastav:
   - Background: `rgba(56, 189, 248, 0.2)`
   - Border: `2px solid rgba(56, 189, 248, 0.5)`
   - Text Color: `var(--main-text)`
   - Border Radius: `var(--radius-button)`

#### Feature Cards
1. Vyber Stack komponent pro kartu
2. Nastav:
   - Background: `rgba(255, 255, 255, 0.1)`
   - Border Radius: `var(--radius-card)`
   - Padding: `var(--spacing-md)`
   - Backdrop Filter: `blur(10px)`

### 5. Přidání Blur Ball efektů (volitelné)

Pro vytvoření floating blur ball efektů:

1. Přidej **Stack** komponenty s position: **absolute**
2. Nastav každý jako kruh:
   - Width/Height: 200px
   - Border Radius: 50%
   - Background: `var(--blur-ball-1)` až `var(--blur-ball-4)`
   - Filter: `blur(60px)`
3. Umísti je na různé pozice:
   - Top-left: `top: -100px, left: -100px`
   - Top-right: `top: 50px, right: -50px`
   - Bottom-left: `bottom: 100px, left: -100px`
   - Bottom-right: `bottom: -50px, right: 50px`

### 6. Dark Mode Support

Pro dark mode podporu použij Dynamic Values:
```javascript
if (device.interfaceStyle === 'dark') {
  backgroundColor = var(--dark-bg)
} else {
  backgroundColor = var(--main-text)
}
```

### 7. Test & Preview

1. Použij **Preview** tlačítko v editoru
2. Testuj na různých zařízeních (iPhone, iPad, Android)
3. Zkontroluj light/dark mode

### 8. Placement Configuration

V kódu používáme placement: `onboarding_complete`

Ujisti se, že máš v Superwall Dashboard:
1. **Placements** → **New Placement**
2. Name: `onboarding_complete`
3. Assign Paywall: Vyber tvou upravenou paywall

## 📱 Test v aplikaci

1. Projdi celým onboarding flow
2. Na stránce "Almost There!" klikni na "Start My Journey"
3. Měla by se zobrazit paywall s naším designem

## 🎯 Checklist

- [ ] Gradient pozadí (modré tóny)
- [ ] Bílý text na tmavém pozadí
- [ ] Bílé CTA tlačítko s tmavým textem
- [ ] Průhledné karty s blur efektem
- [ ] Cyan progress bar nebo akcenty
- [ ] Poppins font (nebo podobný sans-serif)
- [ ] Zakulacené rohy (16px pro karty, 50px pro tlačítka)
- [ ] Text shadows pro lepší čitelnost

## 💡 Tips

- Používej **Option/Alt + Click** na properties pro rychlé přiřazení variables
- Purple indikátor = používá variable
- Změny se projeví okamžitě v preview
- Pro produkční nasazení je potřeba publikovat paywall

## 🔗 Užitečné odkazy

- [Superwall Dashboard](https://dashboard.superwall.com)
- [Paywall Editor Docs](https://superwall.com/docs/paywall-editor-overview)
- [Theme Variables Guide](https://superwall.com/docs/paywall-editor-theme)