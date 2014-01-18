urselect
========

## Getting Started
Include [`css/urselect.css`](css/urselect.css), jQuery library (1.10.2 or later) and [`js/urselect.js`](js/urselect.js) (or [`js/urselect.min.js`](js/urselect.min.js)) in your markup:

```html
<!-- urSelect styles -->
<link rel="stylesheet" href="path/to/urselect.css">
<!-- latest jQuery from google CDN -->
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<!-- urSelect plugin -->
<script src="js/urselect.min.js"></script>
```

## How to use

### Initialization
```javascript
$('select.custom').urSelect();
```

## API reference

Custom select can be reinitialised or destroyed via data access

```javascript
$('select.custom').urSelect();
$('select.custom').html('<option>New option</option>');
$('select.custom').data('customSelect').render();
$('select.custom').data('customSelect').destroy();
```

## License
MIT license