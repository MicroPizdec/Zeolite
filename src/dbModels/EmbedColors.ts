import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table
export default class EmbedColors extends Model {
  @Column(DataType.STRING)
  userID: string;

  @Column(DataType.NUMBER)
  color: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  random: boolean;
}