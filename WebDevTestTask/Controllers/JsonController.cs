using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Runtime.Caching;
using WebDevTestTask.Models;

namespace WebDevTestTask.Controllers
{
    public class JsonController : ApiController
    {
        private Random rnd = new Random();

        [HttpPost]
        public void Save([FromBody] Value value)
        {
            var cache = MemoryCache.Default;

            var policy = new CacheItemPolicy { AbsoluteExpiration = DateTimeOffset.Now.AddHours(1) };

            cache.Add(Constants.Value, value, policy);
        }

        public Value Update()
        {
            var cache = MemoryCache.Default;
            var result = cache.Get(Constants.Value) as Value;
            if (result == null)
            {
                var x1 = rnd.Next(Constants.Width - Constants.DotRadius);
                var y1 = rnd.Next(Constants.Height - Constants.DotRadius);
                var x2 = rnd.Next(Constants.Width - Constants.DotRadius);
                var y2 = rnd.Next(Constants.Height - Constants.DotRadius);
                var color = Constants.Colors[rnd.Next(Constants.Colors.Length)];

                FixCoordinates(ref x1, ref y1);
                FixCoordinates(ref x2, ref y2);

                result = new Value() { X1 = x1, Y1 = y1, X2 = x2, Y2 = y2, Color = color };
            }
            return result;
        }

        private void FixCoordinates(ref int x, ref int y)
        {
            int centerX = -1, centerY = -1;

            if (x < Constants.Radius)
            {
                centerX = Constants.Radius;
            }
            else if (x > Constants.Width - Constants.Radius)
            {
                centerX = Constants.Width - Constants.Radius;
            }

            if (y < Constants.Radius)
            {
                centerY = Constants.Radius;
            }
            else if (y > Constants.Height - Constants.Radius)
            {
                centerY = Constants.Height - Constants.Radius;
            }

            if (centerX > 0 && centerY > 0)
            {
                var dist = Math.Sqrt(Math.Pow(x - centerX, 2) + Math.Pow(y - centerY, 2));
                if (dist > Constants.Radius - Constants.DotRadius)
                {
                    var radians = Math.Atan2(y - centerY, x - centerX);
                    x = (int)Math.Round(centerX + (Constants.Radius - Constants.DotRadius) * Math.Cos(radians) - Constants.DotRadius);
                    y = (int)Math.Round(centerY + (Constants.Radius - Constants.DotRadius) * Math.Sin(radians) - Constants.DotRadius);
                }
            }
        }
    }
}
