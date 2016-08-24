export default function getDateFormats () {
  return {
    "US": [
      /** AMERICAN FORMATS **/
      /* 6/15/2009 */
      "%m/%d/%Y",
      "%m/%d/%y",
      "%-m/%-d/%Y",
      "%-m/%-d/%y",

      /* 6/29/16, 13:34 */
      "%m/%d/%y, %H:%M",
      "%m/%d/%Y, %H:%M",
      "%m/%d/%y, %-H:%M",
      "%m/%d/%Y, %-H:%M",
      "%-m/%-d/%y, %H:%M",
      "%-m/%-d/%Y, %H:%M",
      "%-m/%-d/%y, %-H:%M",
      "%-m/%-d/%Y, %-H:%M",

      /* 6/15/2009 1:45 PM */
      "%m/%d/%y, %I:%M %p",
      "%m/%d/%Y, %I:%M %p",
      "%m/%d/%y, %-I:%M %p",
      "%m/%d/%Y, %-I:%M %p",
      "%-m/%-d/%y, %I:%M %p",
      "%-m/%-d/%Y, %I:%M %p",
      "%-m/%-d/%y, %-I:%M %p",
      "%-m/%-d/%Y, %-I:%M %p",

      /*** YEAR FIRST ***/
      /* 2009/06/15 */
      "%Y/%m/%d",
      "%Y/%-m/%-d",
      /* 2009/6/15 13:45 */
      "%Y/%m/%d, %H:%M",
      "%Y/%m/%d, %-H:%M",
      "%Y/%-m/%-d, %H:%M",
      "%Y/%-m/%-d, %-H:%M",

      "%Y/%m/%d, %I:%M %p",
      "%Y/%m/%d, %-I:%M %p",
      "%Y/%-m/%-d, %I:%M %p",
      "%Y/%-m/%-d, %-I:%M %p"
    ],
    "EU": [
      /** EUROPEAN FORMATS **/
      /* 15/6/2009 */
      "%d/%m/%Y",
      "%d/%m/%y",
      "%-d/%-m/%Y",
      "%-d/%-m/%y",

      /* 29/6/16, 13:34 */
      "%d/%m/%y, %H:%M",
      "%d/%m/%Y, %H:%M",
      "%d/%m/%y, %-H:%M",
      "%d/%m/%Y, %-H:%M",
      "%-d/%-m/%y, %H:%M",
      "%-d/%-m/%Y, %H:%M",
      "%-d/%-m/%y, %-H:%M",
      "%-d/%-m/%Y, %-H:%M",

      /* 15/6/2009 1:45 PM */
      "%d/%m/%y, %I:%M %p",
      "%d/%m/%Y, %I:%M %p",
      "%d/%m/%y, %-I:%M %p",
      "%d/%m/%Y, %-I:%M %p",
      "%-d/%-m/%y, %I:%M %p",
      "%-d/%-m/%Y, %I:%M %p",
      "%-d/%-m/%y, %-I:%M %p",
      "%-d/%-m/%Y, %-I:%M %p"
    ],
    "UN": [
      /* Monday, June 15, 2009 */
      "%b %d, %Y",
      "%b, %d, %Y",
      "%b %d, '%y",
      "%b, %d, '%y",
      /* Monday, June 15, 2009 1:45 PM */
      "%b %d, %Y, %H:%M",
      "%b %d, '%y, %H:%M",
      "%b, %d, %Y, %H:%M",
      "%b, %d, '%y, %H:%M",

      "%b %d, %Y, %I:%M %p",
      "%b %d, '%y, %I:%M %p",
      "%b, %d, %Y, %I:%M %p",
      "%b, %d, '%y, %I:%M %p",

      "%b %-d, %Y, %H:%M",
      "%b %-d, '%y, %H:%M",
      "%b, %-d, %Y, %H:%M",
      "%b, %-d, '%y, %H:%M",

      "%b %-d, %Y, %I:%M %p",
      "%b %-d, '%y, %I:%M %p",
      "%b, %-d, %Y, %I:%M %p",
      "%b, %-d, '%y, %I:%M %p",

      /* Monday, June 15, 2009 8:45:30 PM */
      "%b %d, %Y, %H:%M",
      "%b %d, '%y, %H:%M",
      "%b %d, %Y, %I:%M %p",
      "%b %d, '%y, %I:%M %p"
    ]
  }
}
