export class Tariff {
  //The basic tariff for rent
  public static BASIC = 1000;
  //Tariffs
  public static TARIFFS = [
    {
      daysRange: {
        from: 1,
        to: 4,
      },
      tariff: this.BASIC,
    },
    {
      daysRange: {
        from: 5,
        to: 9,
      },
      tariff: this.BASIC - this.BASIC * 0.05,
    },
    {
      daysRange: {
        from: 10,
        to: 17,
      },
      tariff: this.BASIC - this.BASIC * 0.1,
    },
    {
      daysRange: {
        from: 18,
        to: 29,
      },
      tariff: this.BASIC - this.BASIC * 0.15,
    },
  ];
}
