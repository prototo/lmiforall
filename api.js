(function() {

  var base = 'http://api.lmiforall.org.uk/api/';

  function request(options) {
    _.defaults(options, {
      success: function(res) {
        console.log(res); 
      }
    });
    
    options.url = base + options.url;
    
    $.ajax(options);
  }

  window.api = {
    ashe: {
      estimate: function(soc, filters) {
        request({
          url: 'ashe/estimate',
          data: {
            soc: soc,
            filters: filters
          }
        });
      },

      filter: function(name) {
        request({
          url: 'ashe/filter',
          data: {
            name: name
          }
        });
      },
      
      filters: function(all) {
        request({
          url: all ? 'ashe/filters/all' : 'ashe/filters'
        });
      }
    },

    onet: {
      importance: function(soc) {
        request({
          url: 'onet/importance',
          data: {
            soc: soc
          }
        });
      },

      levels: function(soc) {
        request({
          url: 'onet/levels',
          data: {
            soc: soc
          }
        });
      },

      skills: function() {
        request({
          url: 'onet/skills'
        })
      }
    },

    soc: {
      code: function(code) {
        request({
          url: 'soc/code',
          data: {
            code: code
          }
        });
      },

      search: function(q) {
        request({
          url: 'soc/search',
          data: {
            q: q
          }
        });
      }
    }
    
  };

})()

