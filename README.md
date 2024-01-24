# msc-any-hint

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-any-hint) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/26360/branches/836753/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=26360&bid=836753)

Hint is a very common UI effect to help user easy understand particular nouns. With &lt;msc-any-hint />, developers could adopt this feature to web page easier. Although &lt;msc-any-hint /> looks like same with [&lt;msc-hint />](https://github.com/meistudioli/msc-hint) , but it release summary for developers. That means developers could customize any summary they like.

![msc-any-hint](https://github.com/meistudioli/msc-any-hint/assets/10822546/d1c69fb8-7343-4e58-81bb-67def3ce60c8)


## Basic Usage

&lt;msc-any-hint /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-any-hint />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-any-hint.js">        
</script>
```

- Structure

Put &lt;msc-any-hint /> into HTML document. It will have different functions and looks with attribute mutation.

```html
<msc-any-hint>
  <!-- Put any HTML element you like as summary and add attribute slot="summary" -->
  <button slot="summary">summary</button>

  <!-- Put any HTML element you like as content -->
  <div class="element-i-like-to-have">
    ...
    ...
    ...
  </div>
</msc-any-hint>
```

## JavaScript Instantiation

&lt;msc-any-hint /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscAnyHint } from 'https://your-domain/wc-msc-any-hint.js';

const template = document.querySelector('.my-template');

// use DOM api
const nodeA = document.createElement('msc-any-hint');
document.body.appendChild(nodeA);
nodeA.appendChild(template.content.cloneNode(true));

// new instance with Class
const nodeB = new MscAnyHint();
document.body.appendChild(nodeB);
nodeB.appendChild(template.content.cloneNode(true));

// new instance with Class & default config
const config = {
  hover: true
};
const nodeC = new MscAnyHint(config);
document.body.appendChild(nodeC);
nodeC.appendChild(template.content.cloneNode(true));
</script>
```

## Style Customization

Developers could apply styles to decorate &lt;msc-hint />'s looking.

```html
<style>
msc-any-hint {
  --msc-any-hint-gap: 8px;

  --msc-any-hint-panel-border-radius: 8px;
  --msc-any-hint-panel-padding: 8px;
  --msc-any-hint-panel-background-color: rgba(255 255 255/.9);
  --msc-any-hint-panel-border-color: rgba(199 205 210);
  --msc-any-hint-panel-box-shadow: 0 0 1px rgba(0 0 0/.1), 0 2px 4px rgba(0 0 0/ .08);
}
</style>
```

Otherwise, developers could also apply ::part() to direct style panel.

```html
<style>
msc-any-hint::part(panel) {
  font-size: 16px;
  color: rgb(255 0 0);
  background-color: rgba(0 0 0/.3);
  ...
}
</style>
```

&lt;msc-any-hint />also build-in data attribytes for panel display position.

```html
<msc-any-hint
  data-vertical-align="end"
  data-horizontal-align="center"
>
  ...
  ...
  ...
</msc-any-hint>
```

- data-vertical-align： start || end. Default is `end`.
- data-horizontal-align： start || center || end. Default is `center`.

## Attributes

&lt;msc-hint /> supports some attributes to let it become more convenience & useful.

- **hover**

Set hover able for &lt;msc-hint />. Once setting, &lt;msc-hint /> will popup panel when user hover trigger. Default is `false`（not set）.

```html
<msc-any-hint hover>
  ...
</msc-any-hint>
```

## Property

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| hover | Boolean | Getter / Setter for hover. Default is false. |


## Reference
- [&lt;msc-any-hint /> demo](https://blog.lalacube.com/mei/webComponent_msc-any-hint.html)
- [MDN > ::part()](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [WEBCOMPONENTS.ORG](https://www.webcomponents.org/element/msc-any-hint)
- [YouTube](https://youtube.com/shorts/Bt70ng9xD9k)
