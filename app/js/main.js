import $ from 'jquery'

class Lock {
  constructor (opts = {}) {
    this.pass = [];
    let defaultOpts = {
      el: '#handlock',
      num: 3,
      dockColor: '#fff',
      dockWidth: '30px'
    }
    this.opts =  Object.assign({}, defaultOpts, opts);
    this.init()
    this.eventHandler()
  }
  init () {
    for (let i = 0; i < this.opts.num; i++) {
      let $row = $('<div class="row">')
      for (let j = 0; j < this.opts.num; j++) {
        let $column = $('<div class="column">')
        $column.append($('<span class="dock">'))
        $row.append($column)
      }
      $(this.opts.el).append($row)
    }
    Object.assign(this.opts, {
      boxWidth: $(this.opts.el).width() / this.opts.num,
      gapWidth: ($(this.opts.el).width() / this.opts.num - $('.column').width()) / 2
    })
  }
  eventHandler () {
    let self = this
    let $area = $(this.opts.el)
    // let startX, startY;
    // let $ray = $('<div class="line"></div>')
    this.createRay()
    $area.on('touchstart', function (e) {
      self.startX = e.originalEvent.targetTouches[0].clientX
      self.startY = e.originalEvent.targetTouches[0].clientY
      console.log(self.startX)
      console.log(self.startY)
      $area.append(self.$ray)
    })
    $area.on('touchmove', function (e) {
      // let fx = e.originalEvent.targetTouches[0].clientX
      // let fy = e.originalEvent.targetTouches[0].clientY
      // self.drawLine(e.originalEvent.targetTouches[0], $ray)
      let axis = e.originalEvent.targetTouches[0]
      let diffX = axis.clientX - self.startX,
          diffY = axis.clientY - self.startY;
      let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
      let tan = Math.atan(diffY / diffX)
      let deg = Math.abs(Math.floor(180/(Math.PI/tan)))
      self.$ray.css({
        'transform-origin': '0 50%',
        'transform': 'rotate(' + deg + 'deg)',
        'width': dist + 'px',
        left: self.startX,
        top: self.startY
      })


      let location = self.isTouch(e.originalEvent.targetTouches[0])
      if (location) {
        if (self.pass.indexOf(location) < 0) {
          self.pass.push(location)
          $area.find('.dock').eq(location - 1).addClass('chosen')
          self.pass.length > 1 && self.saveLine()
        }
        console.log(self.pass)
      }
    })
    $area.on('touchend', function (e) {
      self.pass = []
    })
  }
  createRay () {
    this.$ray = $('<div class="line"></div>')
    this.$ray.css({
      'transform-origin': '0 50%'
    })
  }
  saveLine () {
    let start = this.pass[this.pass.length - 2],
        end = this.pass[this.pass.length - 1];
    let startTop = Math.floor(start / this.opts.num) * this.opts.boxWidth + this.opts.boxWidth / 2,
        startLeft = (start % this.opts.num ? start % this.opts.num : this.opts.num) * this.opts.boxWidth - this.opts.boxWidth / 2;
    let endTop = Math.floor(end / this.opts.num) * this.opts.boxWidth + this.opts.boxWidth / 2,
        endLeft = (end % this.opts.num ? end % this.opts.num : this.opts.num) * this.opts.boxWidth - this.opts.boxWidth / 2;
    let diffX = endLeft - startLeft,
        diffY = endTop - startTop; 

    let dist = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
    let tan = Math.atan(diffY / diffX)
    let deg = Math.abs(Math.floor(180/(Math.PI/tan)))

    let $line = $('<div class="line"></div>')
    $line.css({
      'transform-origin': '0 50%',
      'transform': 'rotate(' + deg + 'deg)',
      'width': dist + 'px',
      left: startLeft,
      top: startTop
    })
    $(this.opts.el).append($line)
    this.startX = endLeft;
    this.startY = endTop;
    this.$ray.css({
      left: endLeft,
      top: endTop
    })
  }
  // drawLine (axis, $ray) {
  //   let diffX = axis.clientX - startX,
  //       diffY = axis.clientY - startY;
  //   let dist = Math.sqrt(Math.pow(diffX) + Math.pow(diffY))
  //   let deg = Math.atan(diffY / diffX)
  //   $ray.css('transform', 'rotate(' + deg + ')')
  // }
  isTouch (location) {
    let col = Math.ceil(location.clientX / this.opts.boxWidth)
    let row = Math.floor(location.clientY / this.opts.boxWidth)
    let x = location.clientX % this.opts.boxWidth;
    let y = location.clientY % this.opts.boxWidth;
    if (x < this.opts.gapWidth || x > this.opts.gapWidth + this.opts.dockWidth || y < this.opts.gapWidth || y > this.opts.gapWidth + this.opts.dockWidth ) {
      // console.log('----')
      return false
    }
    // console.log(this.opts.num * row + col)
    return (this.opts.num * row + col)
  }
}

new Lock('.handlock', 'heh')