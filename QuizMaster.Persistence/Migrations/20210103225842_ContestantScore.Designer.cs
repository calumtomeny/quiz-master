﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuizMaster.Persistence;

namespace QuizMaster.Persistence.Migrations
{
    [DbContext(typeof(QuizContext))]
    [Migration("20210103225842_ContestantScore")]
    partial class ContestantScore
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.4");

            modelBuilder.Entity("QuizMaster.Domain.Contestant", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Code")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("QuizId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Score")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("QuizId");

                    b.ToTable("Contestants");
                });

            modelBuilder.Entity("QuizMaster.Domain.ContestantAnswer", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Answer")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("ContestantId")
                        .HasColumnType("TEXT");

                    b.Property<float>("PercentageTimeRemaining")
                        .HasColumnType("REAL");

                    b.Property<Guid>("QuizQuestionId")
                        .HasColumnType("TEXT");

                    b.Property<long>("TimeRemainingMs")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ContestantId");

                    b.HasIndex("QuizQuestionId");

                    b.ToTable("ContestantAnswers");
                });

            modelBuilder.Entity("QuizMaster.Domain.Quiz", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Code")
                        .HasColumnType("TEXT");

                    b.Property<string>("Key")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("QuestionNo")
                        .HasColumnType("INTEGER");

                    b.Property<long>("QuestionStartTime")
                        .HasColumnType("INTEGER");

                    b.Property<int>("State")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Quiz");
                });

            modelBuilder.Entity("QuizMaster.Domain.QuizQuestion", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Answer")
                        .HasColumnType("TEXT");

                    b.Property<int>("Number")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Question")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("QuizId")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("QuizId");

                    b.ToTable("QuizQuestions");
                });

            modelBuilder.Entity("QuizMaster.Domain.Contestant", b =>
                {
                    b.HasOne("QuizMaster.Domain.Quiz", null)
                        .WithMany("Contestants")
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("QuizMaster.Domain.ContestantAnswer", b =>
                {
                    b.HasOne("QuizMaster.Domain.Contestant", null)
                        .WithMany("ContestantAnswers")
                        .HasForeignKey("ContestantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("QuizMaster.Domain.QuizQuestion", null)
                        .WithMany("ContestantAnswers")
                        .HasForeignKey("QuizQuestionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("QuizMaster.Domain.QuizQuestion", b =>
                {
                    b.HasOne("QuizMaster.Domain.Quiz", null)
                        .WithMany("QuizQuestions")
                        .HasForeignKey("QuizId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
