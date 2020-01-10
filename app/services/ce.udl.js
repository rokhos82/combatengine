(function (){
  function factory(_objects) {
    var tags = {
      defense: /(?:defense )(?<defense>\d+)/,
      deflect: /(?:deflect )(?<deflect>\d+)/,
      regen: /(?:regen )(?<regen>\d+)/,
      size: /(?:size )(?<size>\d+)/,
      target: /(?:target )(?<target>\d+)/
    };

    var regex = {
      unit: {
        test: /\[unit.*\]/g,
        decode: /(?:unit\s+name\s+[\"|\'])(?<name>.+?)(?:[\"|\']\s+size\s+)(?<size>\d+)(?:\s+type\s+)(?<type>.+?)(?:[\s|\[])/
      },
      group: {
        name: /(?:name\s+[\"|\'])(?<name>.+?)(?:[\"|\'])/
      },
      armor: {
        scrape: /\[(?<armor>armor.*?)\]/,
        hp: /(?:armor )(?<hp>\d+)/,
        deflect: tags.deflect,
        regen: tags.regen,
        defense: tags.defense
      },
      shield: {
        scrape: /\[(?<shield>shield.*?)\]/,
        max: /(?:max )(?<max>\d+)/,
        current: /(?:current )(?<current>\d+)/,
        deflect: tags.deflect,
        regen: tags.regen,
        defense: tags.defense
      },
      battery: {
        test: /\[battery.+?\]/g,
        scrape: /\[(?<battery>battery.+?)\]/,
        volley: /(?:volley )(?<volley>\d+)/,
        size: tags.size,
        target: tags.target
      },
      launcher: {
        quantity: /(?:launcher )(?<quantity>\d+)/,
        target: tags.target,
        size: tags.size
      },
      stl: {
        test: /\[stl.+?\]/g,
        scrape: /\[(?<stl>stl.+?)\]/
      },
      ftl: {
        test: /\[ftl.+?\]/g,
        scrape: /\[(?<ftl>ftl.+?)\]/
      }
    };

    var $fact = {};

    $fact.parseGroup = function(str) {
      var groupReg = /\[(?<group>group.+)\]/;
      var groupStr = str.match(groupReg).groups.group;
      var name = groupStr.match(regex.group.name).groups.name;
      var group = {}; // Need to change this to a copy of ce.app.objects group object
      group.udl = groupStr;
      group.name = name;

      var unitReg = /\[unit.*\]/g;
      var unitStr = unitReg.exec(str);
      group.units = {};
      do {
        var u = $fact.parseUnit(unitStr[0]);
        group.units[u.name] = u;
        unitStr = unitReg.exec(str);
      } while (unitStr !== null)

      return group;
    };

    $fact.parseUnit = function(str) {
      var unit = {};

      if (regex.unit.test.test(str)) {
        // The string is a unit string
        var info = str.match(regex.unit.decode);
        unit.name = info.groups.name;
        unit.size = parseInt(info.groups.size);
        unit.type = info.groups.type;

        var armor = str.match(regex.armor.scrape).groups.armor;
        unit.armor = {};
        unit.armor.max = armor.match(/(?:max )(?<max>\d+)/).groups.max;
        unit.armor.current = armor.match(/(?:current )(?<current>\d+)/).groups.current;

        var shield = str.match(regex.shield.scrape).groups.shield;
        unit.shield = {};
        unit.shield.max = shield.match(regex.shield.max).groups.max;
        unit.shield.current = shield.match(regex.shield.current).groups.current;

        unit.batteries = $fact.parseBatteries(str);

        unit.launchers = $fact.parseLaunchers(str);

        var stl = str.match(regex.stl.scrape).groups.stl;
        unit.stl = {
          udl: stl
        };

        var ftl = str.match(regex.ftl.scrape).groups.ftl;
        unit.ftl = {
          udl: ftl
        };
      }

      // Reset the regular expressions
      $fact.regexReset();
      return unit;
    };

    $fact.parseBatteries = function(unitStr) {
      var batteries = [];

      var battStr = regex.battery.test.exec(unitStr);
      var limit = 10;
      var count = 0;
      while(battStr !== null && count < limit) {
        var batt = {};

        battStr = battStr[0];
        batt.udl = battStr;
        batteries.push(batt);

        batt.volley = parseInt(battStr.match(regex.battery.volley).groups.volley);
        batt.target = parseInt(battStr.match(regex.battery.target).groups.target);

        battStr = regex.battery.test.exec(unitStr);
        count++;
      }

      regex.battery.test.lastIndex = 0;

      return batteries;
    };

    $fact.parseLaunchers = function(unitStr) {
      var launchers = [];

      return launchers;
    };

    $fact.regexReset = function() {
      _.forEach(regex,function(o) {
        _.forEach(o,function(r) {
          r.lastIndex = 0;
        });
      });
    };

    return $fact;
  }

  factory.$inject = ["ce.app.objects"];

  angular.module("ce.app").factory("ce.app.udl",factory);
})();
