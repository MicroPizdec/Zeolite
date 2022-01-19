import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table
export default class ZetCoinsSettings extends Model {
  @Column(DataType.STRING)
  guildID: string;

  @Column({
    type: DataType.STRING,
    defaultValue: "<:zetcoins:929419222436708373>",
  })
  icon: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  workEnabled: boolean;

  @Column({
    type: DataType.NUMBER,
    defaultValue: 50,
  })
  workMinAmount: number;

  @Column({
    type: DataType.NUMBER,
    defaultValue: 300,
  })
  workMaxAmount: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  diceEnabled: boolean;
}