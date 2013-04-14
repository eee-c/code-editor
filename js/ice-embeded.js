// IceCodeEditor.js 0.0.1

(function(){

// ICE.Embedded
// ------------

// Create a new embedded instance of the ICE Editor from a `script`
// tag.
function Embedded(script, options) {
  this.script = script;
  if (!options) options = {};

  this.sourcecode = this.processSource();
  this.el = this.createEmbeddedElement();

  var that = this;
  this.editor = new ICE.Editor(this.el, {
    onUpdate: function() {that.timeoutPreview();},
    title: options.title
  });
  this.editor.setContent(this.sourcecode);
  this.editor.onUpdate();
  this.applyStyles();
}

// Create the `<div>` element that will hold the editor and preview
// layers.
Embedded.prototype.createEmbeddedElement = function() {
  var el = document.createElement( 'div' );
  this.script.insertAdjacentElement('beforebegin', el);
  return el;
};

// Process the sourcecode from the `<script>` tag. This is ne
Embedded.prototype.processSource = function() {
  return this.script.innerText.
    replace(/^-(\w+)(.*?)\s*\{([\s\S]+)-\}.*$/gm, "\n<$1$2>$3</$1>").
    replace(/^-(\w+)(.*)$/gm, "<$1$2></$1>").
    replace(/^\s+/, '').
    replace(/\s+$/, '');
};

// Start or reset the countdown before the preview layer will be
// removed. The removal is done to prevent high/moderate CPU usage
// from a page element.
Embedded.prototype.timeoutPreview = function() {
  var that = this;
  clearTimeout(this.embed_timeout);
  this.embed_timeout = setTimeout(
    function() {
      that.editor.hidePreview();
    },
    60*1000
  );
};

Embedded.prototype.applyStyles = function() {
  this.editor.el.style.margin = '0px';
  this.editor.el.style.overflow = 'hidden';
  this.editor.el.style.position = 'relative';
  this.editor.el.style.height = '350px';

  this.editor.editor_el.style.width = '100%';
  this.editor.editor_el.style.height = '350px';
  this.editor.editor_el.style.position = 'absolute';
  this.editor.editor_el.display = 'none';

  this.editor.preview_el.style.width = '100%';
  this.editor.preview_el.style.height = '350px';
  this.editor.preview_el.style.position = 'absolute';
  this.editor.preview_el.style.top = '0';
};

// Create a new instance of the embedded code editor for each
// `<script type=text/ice-code>` element on the page.
function attachEmbedded() {
  var i = 0;
  iceCodeScriptTags().forEach(function (script) {
    new Embedded(script, {title: "script-00"+i});
    i++;
  });
}

// Returns a list of all `<script>` tags with `type=text/ice-code`.
function iceCodeScriptTags() {
  var scripts_nodelist = document.getElementsByTagName('script'),
      scripts = Array.prototype.slice.call(scripts_nodelist);

  return scripts.filter(function(s) {
    return s.type == 'text/ice-code';
  });
}

// Export `attachEmbedded()` on the public API for the `ICE` module.
if (!window.ICE) ICE = {};
ICE.attachEmbedded = attachEmbedded;

})();
