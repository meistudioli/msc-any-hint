import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

const defaults = {
  hover: false,
};

const booleanAttrs = ['hover']; // booleanAttrs default should be false
const objectAttrs = [];
const custumEvents = {};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;inline-size:fit-content;display:inline-block;}
:host(:focus-within){pointer-events:none;}

.main {
  --gap: var(--msc-any-hint-gap, 8px);
  --transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  --panel-border-radius: var(--msc-any-hint-panel-border-radius, 8px);
  --panel-padding: var(--msc-any-hint-panel-padding, 8px);
  --panel-background-color: var(--msc-any-hint-panel-background-color, rgba(255 255 255/.9));
  --panel-border-color: var(--msc-any-hint-panel-border-color, rgba(199 205 210));
  --panel-box-shadow: var(--msc-any-hint-panel-box-shadow, 0 0 1px rgba(0 0 0/.1), 0 2px 4px rgba(0 0 0/ .08));

  --panel-opacity-normal: 0;
  --panel-opacity-active: 1;
  --panel-opacity: var(--panel-opacity-normal);

  --panel-scale-normal: 0.001;
  --panel-scale-active: 1;
  --panel-scale: var(--panel-scale-normal);

  --panel-pointer-events-normal: none;
  --panel-pointer-events-active: auto;
  --panel-pointer-events: var(--panel-pointer-events-normal);

  position: relative;
  inline-size: fit-content;
  display: block;
  outline: 0 none;

  &:focus-within {
    --panel-opacity: var(--panel-opacity-active);
    --panel-scale: var(--panel-scale-active);
    --panel-pointer-events: var(--panel-pointer-events-active);
  }

  @media (hover: hover) {
    &.main--hover:hover {
      --panel-opacity: var(--panel-opacity-active);
      --panel-scale: var(--panel-scale-active);
      --panel-pointer-events: var(--panel-pointer-events-active);
    }
  }

  .main__panel {
    --vertical: start;
    --horizontal: center;
    --inset-block: auto calc(var(--gap) * -1);
    --transform-origin-horizontal: 50%;
    --transform-origin-vertical: 0%;

    position: absolute;
    inset-block: var(--inset-block);
    inline-size: 100%;
    block-size: 0px;
    pointer-events: var(--panel-pointer-events);

    display: grid;
    place-content: var(--vertical) var(--horizontal);

    .main__panel__ens {
      background-color: var(--panel-background-color);
      padding: var(--panel-padding);
      border-radius: var(--panel-border-radius);
      border: 1px solid var(--panel-border-color);
      box-shadow: var(--panel-box-shadow);

      opacity: var(--panel-opacity);
      scale: var(--panel-scale);
      transform-origin: var(--transform-origin-horizontal) var(--transform-origin-vertical);
      transition: scale 200ms var(--transition-timing-function), opacity 200ms var(--transition-timing-function);
      will-change: scale,opacity;
    }
  }
}

/* horizontal */
:host([data-horizontal-align="start"]) .main__panel {
  --horizontal: start;
  --transform-origin-horizontal: 0%;
}

:host([data-horizontal-align="end"]) .main__panel {
  --horizontal: end;
  --transform-origin-horizontal: 100%;
}

/* vertical */
:host([data-vertical-align="start"]) .main__panel {
  --vertical: end;
  --transform-origin-vertical: 100%;
  --inset-block: calc(var(--gap) * -1) auto;
}
</style>

<div class="main" ontouchstart="" tabindex="0">
  <slot name="summary"></slot>
  <div class="main__panel">
    <div class="main__panel__ens" part="panel">
      <slot></slot>
    </div>
  </div>
</div>
`;

// Houdini Props and Vals, https://web.dev/at-property/
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-any-hint-gap',
      syntax: '<length>',
      inherits: true,
      initialValue: '8px'
    });

    CSS.registerProperty({
      name: '--msc-any-hint-panel-border-radius',
      syntax: '<length>',
      inherits: true,
      initialValue: '8px'
    });

    CSS.registerProperty({
      name: '--msc-any-hint-panel-padding',
      syntax: '<length>',
      inherits: true,
      initialValue: '8px'
    });

    CSS.registerProperty({
      name: '--msc-any-hint-panel-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(255 255 255/.9)'
    });

    CSS.registerProperty({
      name: '--msc-any-hint-panel-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(199 205 210)'
    });
  } catch(err) {
    console.warn(`msc-any-hint: ${err.message}`);
  }
}

export class MscAnyHint extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      main: this.shadowRoot.querySelector('.main'),
      button: this.shadowRoot.querySelector('.main__trigger')
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscAnyHint(config)
    };
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this.#upgradeProperty(key));
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'hover':
          this.#config[attrName] = true;
          break;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscAnyHint.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'hover':
        this.#nodes.main.classList.toggle('main--hover', this.hover);
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscAnyHint.observedAttributes
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscAnyHint.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set hover(value) {
    this.toggleAttribute('hover', Boolean(value));
  }

  get hover() {
    return this.#config.hover;
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscAnyHint');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscAnyHint'), MscAnyHint);
}